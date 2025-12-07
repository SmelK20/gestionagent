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
    Schema::create('affectations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade');

        // Anciennes informations de l'agent
        $table->string('ancienne_direction')->nullable();
        $table->string('ancien_service')->nullable();
        $table->string('ancienne_fonction')->nullable();
        $table->date('ancienne_date_affectation')->nullable();

        // Nouvelle affectation
        $table->string('direction');
        $table->string('service');
        $table->string('fonction');
        $table->date('date_affectation');

        $table->timestamps();
    });
}




    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('affectations');
    }
};
