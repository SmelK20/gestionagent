<?php

namespace App\Http\Controllers;

use App\Models\AgentNouveau;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\AgentWelcomeMail;

class AgentNouveauController extends Controller
{
    /**
     * Lister tous les agents (avec relations)
     */
    public function index()
    {
        return response()->json(
            AgentNouveau::with([
                'direction:id,libelle',
                'service:id,libelle',
                'fonction:id,libelle',
                // 'ministere:id,libelle', // décommente si tu utilises ministere_id
            ])->orderByDesc('id')->get()
        );
    }

    /**
     * Créer un nouvel agent
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'immatricule' => 'required|string|max:255|unique:agents_nouveau,immatricule',
                'cin' => 'nullable|string|max:20',
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'date_naissance' => 'nullable|date',
                'adresse' => 'nullable|string|max:255',
                'situation_matrimoniale' => 'nullable|string|max:50',
                'sexe' => 'nullable|string|max:10',
                'email' => 'nullable|email|max:150|unique:agents_nouveau,email',
                'telephone' => 'nullable|string|max:30',
                'corps' => 'nullable|string|max:100',
                'grade' => 'nullable|string|max:100',
                'categorie' => 'nullable|string|max:50',
                'diplome' => 'nullable|string|max:150',
                'specialisation' => 'nullable|string|max:150',
                'service_affectation' => 'nullable|string|max:150',
                'date_affectation' => 'nullable|date',

                // ✅ On enregistre les FK (IDs) et pas des strings
                'direction_id' => 'nullable|integer|exists:directions,id',
                'service_id'   => 'nullable|integer|exists:services,id',
                'fonction_id'  => 'nullable|integer|exists:fonctions,id',

                // ✅ si tu utilises une colonne texte ministere (comme ta capture)
                'ministere' => 'nullable|string|max:150',

                // ✅ si tu utilises un FK ministere_id, remplace ministere par :
                // 'ministere_id' => 'nullable|integer|exists:ministeres,id',
            ]);

            // ✅ Valeur par défaut (si tu as la colonne ministere en texte)
            $validated['ministere'] = $validated['ministere'] ?? 'MTEFOP';

            // Génération du mot de passe
            $plainPassword = Str::random(12);
            $validated['mot_de_passe'] = $plainPassword; // mutator => hash

            // Création
            $agent = AgentNouveau::create($validated);

            // ✅ Charger relations pour éviter null côté frontend
            $agent->load([
                'direction:id,libelle',
                'service:id,libelle',
                'fonction:id,libelle',
            ]);

            // Email si présent
            if (!empty($agent->email)) {
                Mail::to($agent->email)->send(new AgentWelcomeMail($agent, $plainPassword));
            }

            return response()->json([
                'message' => 'Agent créé avec succès',
                'agent'   => $agent
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Erreur lors de la création de l’agent',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un agent précis (avec relations)
     */
    public function show($id)
    {
        $agent = AgentNouveau::with([
            'direction:id,libelle',
            'service:id,libelle',
            'fonction:id,libelle',
        ])->findOrFail($id);

        return response()->json($agent);
    }

    /**
     * Mettre à jour un agent
     */
    public function update(Request $request, $id)
    {
        $agent = AgentNouveau::findOrFail($id);

        $validated = $request->validate([
            'immatricule' => 'sometimes|string|max:255|unique:agents_nouveau,immatricule,' . $id,
            'cin' => 'nullable|string|max:20',
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'date_naissance' => 'nullable|date',
            'adresse' => 'nullable|string|max:255',
            'situation_matrimoniale' => 'nullable|string|max:50',
            'sexe' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:150|unique:agents_nouveau,email,' . $id,
            'telephone' => 'nullable|string|max:30',
            'corps' => 'nullable|string|max:100',
            'grade' => 'nullable|string|max:100',
            'categorie' => 'nullable|string|max:50',
            'diplome' => 'nullable|string|max:150',
            'specialisation' => 'nullable|string|max:150',
            'service_affectation' => 'nullable|string|max:150',
            'date_affectation' => 'nullable|date',

            // ✅ FK
            'direction_id' => 'nullable|integer|exists:directions,id',
            'service_id'   => 'nullable|integer|exists:services,id',
            'fonction_id'  => 'nullable|integer|exists:fonctions,id',

            // colonne texte ministere
            'ministere' => 'nullable|string|max:150',
        ]);

        // ✅ par défaut (si tu veux toujours MTEFOP)
        $validated['ministere'] = $validated['ministere'] ?? ($agent->ministere ?? 'MTEFOP');

        $agent->update($validated);

        // ✅ inclure les relations dans la réponse
        $agent->load([
            'direction:id,libelle',
            'service:id,libelle',
            'fonction:id,libelle',
        ]);

        return response()->json($agent);
    }

    /**
     * Supprimer un agent
     */
    public function destroy($id)
    {
        AgentNouveau::destroy($id);
        return response()->json(['message' => 'Agent supprimé avec succès']);
    }

    /**
     * Exporter la liste des agents au format CSV
     */
    public function export()
    {
        $fileName = 'agents_' . now()->format('Ymd_His') . '.csv';

        $columns = [
            'immatricule',
            'nom',
            'prenom',
            'email',
            'telephone',
            'corps',
            'grade',
            'categorie',
            'service_affectation',
            'date_affectation',
        ];

        $agents = AgentNouveau::all($columns);

        $headers = [
            'Content-Type'        => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($agents, $columns) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $columns, ';');

            foreach ($agents as $agent) {
                $row = [];
                foreach ($columns as $col) {
                    $row[] = $agent->$col;
                }
                fputcsv($handle, $row, ';');
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Importer une liste d’agents depuis un CSV
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt'],
        ]);

        $file = $request->file('file');

        if (!$file->isValid()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Fichier invalide.',
            ], 422);
        }

        $path = $file->getRealPath();
        $handle = fopen($path, 'r');

        if ($handle === false) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Impossible de lire le fichier.',
            ], 500);
        }

        $delimiter = ';';
        $headers = fgetcsv($handle, 0, $delimiter);

        if (!$headers) {
            fclose($handle);
            return response()->json([
                'status'  => 'error',
                'message' => 'Le fichier ne contient pas d’entêtes.',
            ], 422);
        }

        $headers = array_map(fn ($h) => strtolower(trim($h)), $headers);

        $created = 0;
        $updated = 0;
        $errors  = [];

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            if (count($row) !== count($headers)) {
                $errors[] = 'Ligne ignorée (nombre de colonnes incorrect).';
                continue;
            }

            $data = array_combine($headers, $row);

            if (empty($data['immatricule'])) {
                $errors[] = 'Ligne ignorée : immatricule manquant.';
                continue;
            }

            $agent = AgentNouveau::where('immatricule', $data['immatricule'])->first();

            $payload = [
                'immatricule'         => $data['immatricule'] ?? null,
                'nom'                 => $data['nom'] ?? null,
                'prenom'              => $data['prenom'] ?? null,
                'email'               => $data['email'] ?? null,
                'telephone'           => $data['telephone'] ?? null,
                'corps'               => $data['corps'] ?? null,
                'grade'               => $data['grade'] ?? null,
                'categorie'           => $data['categorie'] ?? null,
                'service_affectation' => $data['service_affectation'] ?? null,
                'date_affectation'    => $data['date_affectation'] ?? null,
                'ministere'           => 'MTEFOP',
            ];

            try {
                if ($agent) {
                    $agent->update($payload);
                    $updated++;
                } else {
                    $plainPassword = Str::random(12);
                    $payload['mot_de_passe'] = $plainPassword;
                    AgentNouveau::create($payload);
                    $created++;
                }
            } catch (\Exception $e) {
                $errors[] = 'Erreur sur immatricule ' . $data['immatricule'] . ' : ' . $e->getMessage();
            }
        }

        fclose($handle);

        return response()->json([
            'status'  => 'ok',
            'created' => $created,
            'updated' => $updated,
            'errors'  => $errors,
        ]);
    }
}
