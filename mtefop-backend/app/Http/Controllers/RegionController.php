<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    // Toutes les régions
    public function index()
    {
        return response()->json(Region::all());
    }

    // Régions d'une province spécifique
    public function byProvince($province_id)
    {
        return response()->json(Region::where('province_id', $province_id)->get());
    }
}
