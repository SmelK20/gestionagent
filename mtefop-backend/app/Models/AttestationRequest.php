<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttestationRequest extends Model
{
  use HasFactory;

  protected $fillable = [
    'agent_id',
    'request_number',
    'type',
    'motif',
    'status',
    'reviewed_by_admin_id',
    'reviewed_at',
    'admin_comment',
    'pdf_path',
    'generated_at',
  ];

  protected $casts = [
    'reviewed_at' => 'datetime',
    'generated_at' => 'datetime',
  ];

  public function agent()
  {
    return $this->belongsTo(AgentNouveau::class, 'agent_id');
  }

  public function reviewedBy()
  {
    return $this->belongsTo(Admin::class, 'reviewed_by_admin_id');
  }
}
