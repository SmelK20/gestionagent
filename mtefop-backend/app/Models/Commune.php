<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commune extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'district_id'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
