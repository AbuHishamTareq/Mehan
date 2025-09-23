<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Login APIs
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();

        if (!$user) {
            return response()->json(null, 200);
        }

        return response()->json([
            "id"    => $user->id,
            "name"  => $user->name,
            "email" => $user->email,
            // "role"  => $user->role ?? null,
        ]);
    });

    // Dashboard APIs

    // Settings/Permissions APIs
    Route::prefix("permissions")->group(function () {
        Route::get("/index", [PermissionController::class, "index"])->name("setting.permissions.index");
    });

    // Logout APIs
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});