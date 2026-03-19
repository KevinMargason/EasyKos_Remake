<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KosController;
use App\Http\Controllers\Api\RoomController;

$registerApiRoutes = function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::apiResource('kos', KosController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::apiResource('rooms', RoomController::class);
    });
};

$registerApiRoutes();
Route::name('prefixed-api.')->prefix('api')->group($registerApiRoutes);
