<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * User Registration Handler
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|min:3|max:100',
            'no_hp' => 'required|string|min:10|max:20|unique:users,no_hp',
            'password' => 'required|string|size:6|regex:/^[0-9]+$/',
            'email' => 'nullable|email|max:255',
            'role' => 'required|in:owner,tenant,admin',
        ]);

        try {
            $user = User::create([
                'nama' => $validated['nama'],
                'no_hp' => $validated['no_hp'],
                'password' => Hash::make($validated['password']),
                'email' => $validated['email'] ?? null,
                'role' => $validated['role'],
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Registration successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'nama' => $user->nama,
                        'no_hp' => $user->no_hp,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * User Login Handler
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'no_hp' => 'required|string',
            'password' => 'required|string',
        ]);

        // Support login with either phone number or email in the same field.
        $identifier = trim($validated['no_hp']);
        $user = User::where('no_hp', $identifier)
            ->orWhere('email', $identifier)
            ->first();

        // Verify password using Hash::check()
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Generate authentication token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nama' => $user->nama,
                    'no_hp' => $user->no_hp,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token
            ]
        ], 200);
    }

    /**
     * User Logout Handler
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Get Current User
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $request->user()
            ]
        ]);
    }
}
