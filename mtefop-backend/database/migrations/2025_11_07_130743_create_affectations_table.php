<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();

            // Référence à l'agent
            $table->foreignId('agent_id')->constrained('agents_nouveau')->onDelete('cascade');

            // Références hiérarchiques (si tu les utilises)
            $table->foreignId('province_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('region_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('district_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('commune_id')->nullable()->constrained()->onDelete('cascade');

            // Références service et fonction
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('fonction_id')->nullable()->constrained()->onDelete('cascade');

            // Informations supplémentaires
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->string('statut')->default('active');
            $table->text('observation')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
