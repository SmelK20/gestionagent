<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::table('agents_nouveau', function (Blueprint $table) {
    $table->foreignId('direction_id')->nullable()->constrained('directions')->nullOnDelete();
    $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
    $table->foreignId('fonction_id')->nullable()->constrained('fonctions')->nullOnDelete();

    // Si tu avais des colonnes texte direction/service/fonction, tu peux les supprimer après
    // $table->dropColumn(['direction', 'service', 'fonction']);
});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            //
        });
    }
};
