<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('attestation_requests', function (Blueprint $table) {
      $table->id();

      $table->foreignId('agent_id')->constrained('agents_nouveau')->cascadeOnDelete();
      $table->string('request_number')->unique(); // ex: ATT-2025-000123

      $table->string('type')->default('ATTESTATION_DE_TRAVAIL'); 
      $table->text('motif')->nullable();

      $table->enum('status', ['EN_ATTENTE', 'APPROUVEE', 'REFUSEE'])->default('EN_ATTENTE');

      $table->foreignId('reviewed_by_admin_id')->nullable()->constrained('admins')->nullOnDelete();
      $table->timestamp('reviewed_at')->nullable();
      $table->text('admin_comment')->nullable();

      $table->string('pdf_path')->nullable(); // storage path
      $table->timestamp('generated_at')->nullable();

      $table->timestamps();
      $table->index(['agent_id', 'status']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('attestation_requests');
  }
};
