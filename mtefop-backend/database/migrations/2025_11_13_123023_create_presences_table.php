<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute la migration.
     */
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();

            // 🔗 Lien vers l'agent concerné
            $table->foreignId('agent_id')
                  ->constrained('agents_nouveau')
                  ->onDelete('cascade');

            // 📅 Date de la présence
            $table->date('date');

            // ✅ Statut du jour
            $table->enum('statut', ['present', 'absent', 'retard', 'permission'])
                  ->default('present');

            // 🕗 Heures d'arrivée et de départ
            $table->time('heure_arrivee')->nullable();
            $table->time('heure_depart')->nullable();

            // 📝 Motif en cas d'absence ou retard
            $table->text('motif')->nullable();

            $table->timestamps();

            // ⚠️ Empêche la duplication d'une présence par jour pour un même agent
            $table->unique(['agent_id', 'date']);
        });
    }

    /**
     * Annule la migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
