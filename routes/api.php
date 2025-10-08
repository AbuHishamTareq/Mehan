<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
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

    // Settings/Modules APIs
    Route::prefix("modules")->group(function () {
        Route::get("/index", [ModuleController::class, "index"])->name("setting.modules.index");
        Route::post("/store", [ModuleController::class, "store"])->name("setting.modules.store");
        Route::put("/update/{id}", [ModuleController::class, "update"])->name("setting.modules.update");
    });

    // Settings/Permissions APIs
    Route::prefix("permissions")->group(function () {
        Route::get("/index", [PermissionController::class, "index"])->name("setting.permissions.index");
        Route::post("/store", [PermissionController::class, "store"])->name("setting.permissions.store");
        Route::put("/update/{id}", [PermissionController::class, "update"])->name("setting.permissions.update");
        Route::put("/bulkActivate", [PermissionController::class, "bulkActivate"])->name("setting.permissions.bulkActivate");
        Route::put("/bulkDeactivate", [PermissionController::class, "bulkDeactivate"])->name("setting.permissions.bulkDeactivate");
        Route::put("/activeDeactivate", [PermissionController::class, "activeDeactivate"])->name("setting.permissions.activeDeactivate");
    });

    // Settings/Roles APIs
    Route::prefix("roles")->group(function () {
        Route::get("/index", [RoleController::class, "index"])->name("setting.roles.index");
        Route::post("/store", [RoleController::class, "store"])->name("setting.roles.store");
        Route::put("/update/{id}", [RoleController::class, "update"])->name("setting.roles.update");
        Route::put("/bulkActivate", [RoleController::class, "bulkActivate"])->name("setting.roles.bulkActivate");
        Route::put("/bulkDeactivate", [RoleController::class, "bulkDeactivate"])->name("setting.roles.bulkDeactivate");
        Route::put("/activeDeactivate", [RoleController::class, "activeDeactivate"])->name("setting.roles.activeDeactivate");
    });

    // Settings/Departments APIs
    Route::prefix("departments")->group(function () {
        Route::get("/index", [DepartmentController::class, "index"])->name("setting.departments.index");
        Route::post("/store", [DepartmentController::class, "store"])->name("setting.departments.store");
        Route::put("/update/{id}", [DepartmentController::class, "update"])->name("setting.departments.update");
        Route::put("/bulkActivate", [DepartmentController::class, "bulkActivate"])->name("setting.departments.bulkActivate");
        Route::put("/bulkDeactivate", [DepartmentController::class, "bulkDeactivate"])->name("setting.departments.bulkDeactivate");
        Route::put("/activeDeactivate", [DepartmentController::class, "activeDeactivate"])->name("setting.departments.activeDeactivate");
        Route::delete("/destroy/{id}", [DepartmentController::class, "destroy"])->name("setting.departments.destroy");
        Route::patch("/restore/{id}", [DepartmentController::class, "restore"])->name("setting.departments.restore");
        Route::post('/import', [DepartmentController::class, 'import'])->name('setting.departments.import');
    });

    // Logout APIs
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});
