<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\RewardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Resource routes
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('tenants', TenantController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('achievements', AchievementController::class);
    Route::apiResource('rewards', RewardController::class);
    
    // Additional routes for rewards
    Route::post('/rewards/{reward}/claim', [RewardController::class, 'claim']);
});
