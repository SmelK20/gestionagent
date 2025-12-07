<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            // Supprimer les anciennes colonnes texte si elles existent
            if (Schema::hasColumn('agents_nouveau', 'ministere')) {
                $table->dropColumn('ministere');
            }
            if (Schema::hasColumn('agents_nouveau', 'direction')) {
                $table->dropColumn('direction');
            }
            if (Schema::hasColumn('agents_nouveau', 'service')) {
                $table->dropColumn('service');
            }
            if (Schema::hasColumn('agents_nouveau', 'fonction')) {
                $table->dropColumn('fonction');
            }

            // Ajouter les nouvelles colonnes (relations)
            $table->foreignId('ministere_id')->nullable()->constrained('ministeres')->nullOnDelete();
            $table->foreignId('direction_id')->nullable()->constrained('directions')->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->foreignId('fonction_id')->nullable()->constrained('fonctions')->nullOnDelete();
        });
    }

    public function down(): void {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            $table->dropForeign(['ministere_id']);
            $table->dropForeign(['direction_id']);
            $table->dropForeign(['service_id']);
            $table->dropForeign(['fonction_id']);
            $table->dropColumn(['ministere_id', 'direction_id', 'service_id', 'fonction_id']);

            $table->string('ministere')->nullable();
            $table->string('direction')->nullable();
            $table->string('service')->nullable();
            $table->string('fonction')->nullable();
        });
    }
};
