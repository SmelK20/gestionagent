<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AgentController,
    MissionController,
    AuthController,
    MinistereController,
    DirectionController,
    ServiceController,
    FonctionController,
    ConfigurationController,
    AgentNouveauController,
    AdministrationController,
    ProvinceController,
    RegionController,
    DistrictController,
    CommuneController,
    CongeController,
    PresenceController,
    AffectationController,
    PromotionController,
    AdminProfileController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ===============================
// 🔐 AUTHENTIFICATION
// ===============================
Route::post('/login', [AuthController::class, 'universalLogin']);
Route::post('/admin/register', [AuthController::class, 'register']);

// ✅ Routes protégées par Sanctum pour tous
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// API.php
Route::middleware('auth:sanctum')->get('/agents/profile', [AgentController::class, 'profile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/agents_nouveau/export', [AgentNouveauController::class, 'export']);
    Route::post('/agents_nouveau/import', [AgentNouveauController::class, 'import']);
});

// ===============================
// 📦 RESSOURCES PRINCIPALES
// ===============================
Route::apiResource('agents', AgentController::class);
Route::apiResource('agents_nouveau', AgentNouveauController::class);
Route::apiResource('missions', MissionController::class);
Route::apiResource('ministeres', MinistereController::class);
Route::apiResource('directions', DirectionController::class);
Route::apiResource('services', ServiceController::class);
Route::apiResource('fonctions', FonctionController::class);
Route::apiResource('configurations', ConfigurationController::class);

// ===============================
// 🏛️ ADMINISTRATION
// ===============================
Route::get('/administration-lists', [AdministrationController::class, 'lists']);

// ===============================
// GÉOGRAPHIE
// ===============================
Route::get('/provinces', [ProvinceController::class, 'index']);
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/districts', [DistrictController::class, 'index']);
Route::get('/communes', [CommuneController::class, 'index']);

// Routes filtrées
Route::get('/regions/{province_id}', [RegionController::class, 'byProvince']);
Route::get('/districts/{region_id}', [DistrictController::class, 'byRegion']);
Route::get('/communes/{district_id}', [CommuneController::class, 'byDistrict']);

// ===============================
// ROUTES CONGÉS
// ===============================

Route::middleware(['auth:sanctum', 'auth:agent'])->group(function () {
    Route::get('/agent/presences', [PresenceController::class, 'indexAgent']);
    Route::post('/agent/presences', [PresenceController::class, 'store']);
    Route::put('/agent/presences/{id}', [PresenceController::class, 'updateAgent']); // ← nouvelle route
});

// Routes admin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/conges', [CongeController::class, 'indexAdmin']);
    Route::patch('/admin/conges/{id}', [CongeController::class, 'updateStatut']);
});

// Routes pour les agents (protégées)
Route::middleware(['auth:sanctum', 'auth:agent'])->group(function () {
    Route::get('/agent/presences', [PresenceController::class, 'indexAgent']);
    Route::post('/agent/presences', [PresenceController::class, 'store']);
});

// Routes admin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/presences', [PresenceController::class, 'index']);
    Route::put('/admin/presences/{id}', [PresenceController::class, 'update']);
    Route::delete('/admin/presences/{id}', [PresenceController::class, 'destroy']);
});


// ===============================
// 📁 CARRIÈRES (Affectation, Promotion, Mouvement, Avancement)
// ===============================
Route::middleware('auth:sanctum')->group(function () {
    // Affectations
    Route::get('/affectations', [AffectationController::class, 'index']);
    Route::post('/affectations', [AffectationController::class, 'store']);

    // Promotions
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::post('/promotions', [PromotionController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'auth:agent'])->group(function () {
    Route::get('/agent/conges', [CongeController::class, 'indexAgent']);
    Route::post('/agent/conges', [CongeController::class, 'store']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AdminProfileController::class, 'show']);
    Route::put('/admin/profile', [AdminProfileController::class, 'update']);
});