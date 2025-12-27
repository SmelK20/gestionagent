<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.4; }
    .header { text-align:center; margin-bottom: 24px; }
    .title { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-top: 10px; }
    .meta { margin-top: 16px; }
    .box { border: 1px solid #222; padding: 14px; margin-top: 18px; }
    .signature { margin-top: 50px; display:flex; justify-content: space-between; }
    .small { font-size: 10px; color:#444; }
  </style>
</head>
<body>
  <div class="header">
    <div><strong>République de Madagascar</strong></div>
    <div>Ministère du Travail, de l’Emploi et de la Fonction Publique</div>
    <div class="title">Attestation</div>
    <div class="meta">N° : <strong>{{ $requestNumber }}</strong></div>
  </div>

  <div class="box">
    <p>Je soussigné(e), <strong>{{ $adminName }}</strong>, atteste que :</p>

    <p>
      <strong>{{ $agent->prenom }} {{ $agent->nom }}</strong>,
      immatricule <strong>{{ $agent->immatricule }}</strong>,
      est un agent du <strong>MTEFOP</strong>.
    </p>

    <p>
      Direction : <strong>{{ $direction }}</strong><br/>
      Service : <strong>{{ $service }}</strong><br/>
      Fonction : <strong>{{ $fonction }}</strong>
    </p>

    @if(!empty($motif))
      <p>Motif de la demande : <strong>{{ $motif }}</strong></p>
    @endif

    <p>Fait pour servir et valoir ce que de droit.</p>

    <p>
      Fait à Antananarivo, le <strong>{{ $date }}</strong>.
    </p>
  </div>

  <div class="signature">
    <div>
      <div class="small">Cachet & Signature</div>
      <div style="height:80px;"></div>
      <div><strong>{{ $adminName }}</strong></div>
    </div>
    <div class="small">
      Document généré automatiquement via MTEFOP Digital
    </div>
  </div>
</body>
</html>
