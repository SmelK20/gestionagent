<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->string('code')->default('MTEFOP-2024');
            $table->integer('niveaux_hiérarchiques')->default(4);
            $table->string('workflow')->default('Chef → Directeur → Ministre');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('configurations');
    }
};
