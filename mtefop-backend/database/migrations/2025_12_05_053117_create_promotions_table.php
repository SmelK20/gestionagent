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
    Schema::create('promotions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade');

        // Ancien grade de l'agent
        $table->string('ancien_grade')->nullable();

        // Nouvelle promotion
        $table->string('nouveau_grade');
        $table->date('date_promotion');

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
        Schema::dropIfExists('promotions');
    }
};
