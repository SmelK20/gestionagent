<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Direction extends Model {
    use HasFactory;
    protected $fillable = ['nom', 'ministere_id'];
    public function ministere() {
        return $this->belongsTo(Ministere::class);
    }
    public function services() {
        return $this->hasMany(Service::class);
    }
}
