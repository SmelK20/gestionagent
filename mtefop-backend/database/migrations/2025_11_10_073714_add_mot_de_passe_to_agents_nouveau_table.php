<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            $table->string('mot_de_passe')->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('agents_nouveau', function (Blueprint $table) {
            $table->dropColumn('mot_de_passe');
        });
    }
};

