<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('agents_nouveau', function (Blueprint $table) {
            $table->id();

            // Informations personnelles
            $table->string('immatricule')->unique();
            $table->string('cin')->nullable();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance')->nullable();
            $table->string('adresse')->nullable();
            $table->string('situation_matrimoniale')->nullable();
            $table->enum('sexe', ['Masculin', 'Féminin'])->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();

            // Informations professionnelles
            $table->string('corps')->nullable();
            $table->string('grade')->nullable();
            $table->string('categorie')->nullable();
            $table->string('diplome')->nullable();
            $table->string('specialisation')->nullable();
            $table->string('service_affectation')->nullable();
            $table->date('date_affectation')->nullable();
            $table->string('ministere')->nullable();
            $table->string('direction')->nullable();
            $table->string('service')->nullable();
            $table->string('fonction')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('agents_nouveau');
    }
};
