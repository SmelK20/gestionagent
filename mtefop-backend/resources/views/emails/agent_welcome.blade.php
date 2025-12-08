<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Vos accès MTEFOP Digital</title>
</head>
<body>
    <p>Bonjour {{ $agent->prenom }} {{ $agent->nom }},</p>

    <p>Un compte vient d'être créé pour vous sur la plateforme <strong>MTEFOP Digital</strong>.</p>

    <p>Voici vos informations de connexion :</p>

    <ul>
        <li><strong>Email :</strong> {{ $agent->email }}</li>
        <li><strong>Mot de passe provisoire :</strong> {{ $plainPassword }}</li>
    </ul>

    <p>
        Pour des raisons de sécurité, veuillez vous connecter dès que possible et
        <strong>changer ce mot de passe</strong> dans votre espace profil.
    </p>

    <p>Cordialement,<br>L’équipe MTEFOP Digital</p>
</body>
</html>
