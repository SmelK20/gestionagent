<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();

            // Agent concerné
            $table->foreignId('agent_id')
                  ->constrained('agents_nouveau')
                  ->onDelete('cascade');

            // Ancienne affectation (avant changement)
            $table->string('ancienne_direction')->nullable();
            $table->string('ancien_service')->nullable();
            $table->string('ancienne_fonction')->nullable();
            $table->date('ancienne_date_affectation')->nullable();

            // Nouvelle affectation (après changement)
            $table->string('direction');   // nouvelle direction
            $table->string('service');     // nouveau service
            $table->string('fonction');    // nouvelle fonction
            $table->date('date_affectation'); // date du changement

            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('affectations');
    }
};
