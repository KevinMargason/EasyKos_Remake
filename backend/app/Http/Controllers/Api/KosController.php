<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kos;

class KosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $kos = Kos::with('rooms')->get();
        return response()->json(['status' => 'sukses', 'data' => $kos], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'nama' => 'required|string',
            'alamat' => 'required|string',
            'jumlah_kamar' => 'required|string',
            'gender' => 'required|in:Putra,Putri,Campur',
            'region_idregion' => 'required|integer'
        ]);

        $kos = Kos::create($validated);

        return response()->json(['status' => 'sukses', 'pesan' => 'Kos berhasil ditambahkan', 'data' => $kos], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
