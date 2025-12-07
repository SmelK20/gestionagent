<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ministere;
use App\Models\Direction;
use App\Models\Service;
use App\Models\Fonction;

class AdministrationController extends Controller
{
    public function lists()
    {
        return response()->json([
            'ministeres' => Ministere::all(),
            'directions' => Direction::all(),
            'services'   => Service::all(),
            'fonctions'  => Fonction::all(),
        ]);
    }
}
