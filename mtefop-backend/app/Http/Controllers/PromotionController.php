<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        return Promotion::with('agent')->orderBy('date_promotion','desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'agent_id' => 'required|exists:agents,id',
            'ancien_grade' => 'required|string',
            'nouveau_grade' => 'required|string',
            'date_promotion' => 'required|date',
        ]);

        $promotion = Promotion::create($data);

        return response()->json($promotion, 201);
    }
}
