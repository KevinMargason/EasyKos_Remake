<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with('tenants')->get();
        return response()->json($rooms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|unique:rooms',
            'room_type' => 'required|string',
            'floor' => 'required|integer',
            'capacity' => 'required|integer',
            'price' => 'required|numeric',
            'facilities' => 'nullable|array',
            'status' => 'required|in:available,occupied,maintenance',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $room = Room::create($validated);
        return response()->json($room, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::with('tenants')->findOrFail($id);
        return response()->json($room);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $room = Room::findOrFail($id);
        
        $validated = $request->validate([
            'room_number' => 'sometimes|string|unique:rooms,room_number,' . $id,
            'room_type' => 'sometimes|string',
            'floor' => 'sometimes|integer',
            'capacity' => 'sometimes|integer',
            'price' => 'sometimes|numeric',
            'facilities' => 'nullable|array',
            'status' => 'sometimes|in:available,occupied,maintenance',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $room->update($validated);
        return response()->json($room);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
        return response()->json(['message' => 'Room deleted successfully']);
    }
}
