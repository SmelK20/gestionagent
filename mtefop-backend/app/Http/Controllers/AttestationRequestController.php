<?php

namespace App\Http\Controllers;

use App\Models\AttestationRequest;
use App\Models\AgentNouveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class AttestationRequestController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:sanctum');
  }

  // ✅ Agent: mes demandes
  public function myRequests(Request $request)
  {
    $agent = $request->user(); // AgentNouveau authentifié
    $rows = AttestationRequest::with(['reviewedBy'])
      ->where('agent_id', $agent->id)
      ->orderByDesc('id')
      ->get();

    return response()->json($rows);
  }

  // ✅ Agent: créer demande
  public function store(Request $request)
  {
    $agent = $request->user();

    $validated = $request->validate([
      'type' => 'required|string|max:80',
      'motif' => 'nullable|string|max:1000',
    ]);

    $requestNumber = $this->generateRequestNumber();

    $row = AttestationRequest::create([
      'agent_id' => $agent->id,
      'request_number' => $requestNumber,
      'type' => $validated['type'],
      'motif' => $validated['motif'] ?? null,
      'status' => 'EN_ATTENTE',
    ]);

    return response()->json($row, 201);
  }

  // ✅ Admin: liste toutes les demandes
  public function index(Request $request)
  {
    // Ici tu dois sécuriser: seulement admin
    // Option simple: middleware/guard admin (selon ton projet).
    // Pour l’instant on renvoie tout.
    $rows = AttestationRequest::with(['agent', 'reviewedBy'])
      ->orderByDesc('id')
      ->get();

    return response()->json($rows);
  }

  // ✅ Admin: approuver/refuser
  public function review(Request $request, $id)
  {
    $validated = $request->validate([
      'action' => 'required|in:APPROUVER,REFUSER',
      'admin_comment' => 'nullable|string|max:1000',
    ]);

    $row = AttestationRequest::with(['agent'])->findOrFail($id);

    if ($row->status !== 'EN_ATTENTE') {
      return response()->json(['message' => 'Cette demande a déjà été traitée.'], 422);
    }

    // ⚠️ récupérer admin connecté (selon ton auth)
    $admin = $request->user(); // ici suppose admin authentifié

    if ($validated['action'] === 'REFUSER') {
      $row->update([
        'status' => 'REFUSEE',
        'reviewed_by_admin_id' => $admin->id ?? null,
        'reviewed_at' => now(),
        'admin_comment' => $validated['admin_comment'] ?? null,
      ]);

      return response()->json($row);
    }

    // APPROUVER => générer PDF
    $pdfPath = $this->generatePdfForRequest($row, $admin);

    $row->update([
      'status' => 'APPROUVEE',
      'reviewed_by_admin_id' => $admin->id ?? null,
      'reviewed_at' => now(),
      'admin_comment' => $validated['admin_comment'] ?? null,
      'pdf_path' => $pdfPath,
      'generated_at' => now(),
    ]);

    return response()->json($row->fresh(['agent', 'reviewedBy']));
  }

  // ✅ Agent: télécharger PDF (seulement si APPROUVEE et owner)
  public function download(Request $request, $id)
  {
    $agent = $request->user();
    $row = AttestationRequest::where('id', $id)
      ->where('agent_id', $agent->id)
      ->firstOrFail();

    if ($row->status !== 'APPROUVEE' || !$row->pdf_path) {
      return response()->json(['message' => 'Attestation indisponible.'], 403);
    }

    if (!Storage::disk('public')->exists($row->pdf_path)) {
      return response()->json(['message' => 'Fichier introuvable.'], 404);
    }

    return Storage::disk('public')->download($row->pdf_path);
  }

  private function generateRequestNumber(): string
  {
    // ATT-YYYY-XXXXXX
    $year = now()->format('Y');
    $rand = str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
    return "ATT-{$year}-{$rand}";
  }

  private function generatePdfForRequest(AttestationRequest $row, $admin): string
  {
    $agent = $row->agent;

    // Si ton AgentNouveau stocke direction/service/fonction par relations IDs :
    $agent->load(['direction', 'service', 'fonction']);

    $direction = $agent->direction?->libelle ?? '—';
    $service   = $agent->service?->libelle ?? '—';
    $fonction  = $agent->fonction?->libelle ?? '—';

    $adminName = $admin->nom ?? $admin->name ?? 'Administrateur';

    $pdf = Pdf::loadView('pdf.attestation', [
      'agent' => $agent,
      'requestNumber' => $row->request_number,
      'motif' => $row->motif,
      'date' => now()->format('d/m/Y'),
      'adminName' => $adminName,
      'direction' => $direction,
      'service' => $service,
      'fonction' => $fonction,
    ])->setPaper('A4', 'portrait');

    $fileName = $row->request_number . '.pdf';
    $path = 'attestations/' . $agent->id . '/' . $fileName;

    Storage::disk('public')->put($path, $pdf->output());

    return $path;
  }
}
