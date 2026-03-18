<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KosController;
use App\Http\Controllers\Api\RoomController;

$registerApiRoutes = function (): void {
    // Public routes (Authentication)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::apiResource('kos', KosController::class);
        Route::apiResource('rooms', RoomController::class);
    });
};

// Support both /login and /api/login style paths.
$registerApiRoutes();
Route::prefix('api')->group($registerApiRoutes);
