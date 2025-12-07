<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            // 🔸 On supprime d'abord les anciennes colonnes s'il y en a
            if (Schema::hasColumn('agents_nouveau', 'ministere_id')) {
                $table->dropForeign(['ministere_id']);
                $table->dropColumn('ministere_id');
            }
            if (Schema::hasColumn('agents_nouveau', 'direction_id')) {
                $table->dropForeign(['direction_id']);
                $table->dropColumn('direction_id');
            }
            if (Schema::hasColumn('agents_nouveau', 'service_id')) {
                $table->dropForeign(['service_id']);
                $table->dropColumn('service_id');
            }
            if (Schema::hasColumn('agents_nouveau', 'fonction_id')) {
                $table->dropForeign(['fonction_id']);
                $table->dropColumn('fonction_id');
            }

            // 🔹 Puis on recrée les colonnes au bon format (bigint unsigned)
        $table->string('ministere')->default('MTEFOP'); // Toujours MTEFOP
        $table->string('direction')->nullable();        // Texte libre
        $table->string('service')->nullable();          // Texte libre
        $table->string('fonction')->nullable();         // Texte libre

        });
    }

    public function down(): void
    {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            $table->dropForeign(['ministere_id']);
            $table->dropForeign(['direction_id']);
            $table->dropForeign(['service_id']);
            $table->dropForeign(['fonction_id']);

            $table->dropColumn(['ministere_id', 'direction_id', 'service_id', 'fonction_id']);
        });
    }
};
