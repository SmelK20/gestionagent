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
    Schema::create('avancements', function (Blueprint $table) {
        $table->id();
        $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade');

        // Ancienne catégorie
        $table->string('ancienne_categorie')->nullable();

        // Nouvelle catégorie
        $table->string('nouvelle_categorie');
        $table->date('date_avancement');

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
        Schema::dropIfExists('avancements');
    }
};
