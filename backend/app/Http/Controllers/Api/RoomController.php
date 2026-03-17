<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rooms;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $rooms = Rooms::with(['kos', 'tenant'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $rooms
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'kos_id' => 'required|integer|exists:kos,id',
            'nomor_kamar' => 'required|string|max:45',
            'ukuran_kamar' => 'required|string|max:45',
            'listrik' => 'required|in:token,pasca_bayar,tidak_ada',
            'harga' => 'required|integer',
            'users_id' => 'required|integer|exists:users,id'
        ]);

        try {
            $room = Rooms::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Kamar berhasil ditambahkan',
                'data' => $room
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan kamar: ' . $e->getMessage()
            ], 500);
        }
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
