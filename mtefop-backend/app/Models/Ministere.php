<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ministere extends Model {
    use HasFactory;
    protected $fillable = ['nom', 'description'];
    public function directions() {
        return $this->hasMany(Direction::class);
    }
}
