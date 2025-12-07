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
    Schema::create('mouvements', function (Blueprint $table) {
        $table->id();
        $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade');

        // Ancien poste
        $table->string('ancien_poste')->nullable();

        // Nouveau poste
        $table->string('nouveau_poste');
        $table->date('date_mouvement');

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
        Schema::dropIfExists('mouvements');
    }
};
