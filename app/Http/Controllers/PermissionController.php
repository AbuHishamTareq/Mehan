<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index() : JsonResponse {
        $permissions = Permission::get();

        return response()->json([
            "permissions" => $permissions
        ]);
    }
}
