<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conges', function (Blueprint $table) {
            $table->id();
            
            // ✅ Clé étrangère corrigée
            $table->foreignId('agent_id')
                  ->constrained('agents_nouveau') // <-- pointe vers la bonne table
                  ->onDelete('cascade');
            
            $table->string('type'); // Congés payés, Maladie, Sans solde, Formation
            $table->date('date_debut');
            $table->date('date_fin');
            $table->integer('duree'); // calculée en jours
            $table->enum('statut', ['en_attente', 'approuve', 'refuse'])->default('en_attente');
            $table->text('motif');
            $table->string('remplacant')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('conges');
    }
};
