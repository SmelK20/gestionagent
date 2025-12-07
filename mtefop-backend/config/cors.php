<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Port exact où ton frontend Vite tourne (npm run dev)
    'allowed_origins' => ['https://localhost:8080'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // nécessaire pour envoyer les cookies avec Sanctum
    'supports_credentials' => true, 
];


