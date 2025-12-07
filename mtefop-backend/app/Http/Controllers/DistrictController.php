<?php

namespace App\Http\Controllers;

use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    // Tous les districts
    public function index()
    {
        return response()->json(District::all());
    }

    // Districts d'une région spécifique
    public function byRegion($region_id)
    {
        return response()->json(District::where('region_id', $region_id)->get());
    }
}
