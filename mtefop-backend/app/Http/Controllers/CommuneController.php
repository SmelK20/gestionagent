<?php

namespace App\Http\Controllers;

use App\Models\Commune;
use Illuminate\Http\Request;

class CommuneController extends Controller
{
    // Toutes les communes
    public function index()
    {
        return response()->json(Commune::all());
    }

    // Communes d'un district spécifique
    public function byDistrict($district_id)
    {
        return response()->json(Commune::where('district_id', $district_id)->get());
    }
}
