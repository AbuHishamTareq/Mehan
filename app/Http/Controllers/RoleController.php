<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Role::query()->with("permissions");

        if ($search = $request->query("search")) {
            $query->where("label", "ilike", "%{$search}%")
                ->orWhere("description", "ilike", "%{$search}%");
        }

        $perPage = $request->query("perPage", 10);

        $roles = $query->orderBy("created_at", "DESC")->paginate($perPage);

        $permissions = Permission::with("module")->get()->groupBy("module.label")->map(function ($permissions) {
            return $permissions->map(function ($permission) {
                return [
                    "id"          => $permission->id,
                    "label"       => $permission->label,
                    "description" => $permission->description,
                    "is_active"   => $permission->is_active,
                    "module"      => $permission->module->label,
                ];
            })->values();
        });

        return response()->json([
            "roles" => $roles,
            "permissions" => $permissions
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            "permissions" => "required|array",
            "permissions.*" => "integer|exists:permissions,id",
            "label" => "required|string",
        ]);

        $role = Role::create([
            "label" => $request->input("label"),
            "name" => Str::slug($request->input("label"), "_"),
            "description" => $request->input("description") ?? null,
            "is_active" => $request->input("is_active") ?? true,
        ]);

        if (!$role) {
            return response()->json([
                "message" => "Unable to create role. Please try again !",
                "status" => 500
            ], 500);
        }

        $role->syncPermissions($request["permissions"]);

        return response()->json([
            "message" => "Role created successfully",
            "status" => 201 // HTTP status code for Created
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            "permissions" => "required|array",
            "permissions.*" => "integer|exists:permissions,id",
            "label" => "required|string",
        ]);

        $role = Role::find($id);

        if ($role) {
            $role->label = $request->input("label");
            $role->description = $request->input("description");
            $role->save();

            $role->syncPermissions($request->input("permissions"));

            return response()->json([
                "message" => "Role updated successfully!",
                "status" => 200
            ], 200);
        }

        return response()->json([
            "message" => "Unable to update role. Please try again!",
            "status" => 500
        ], 500);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:roles,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid roles IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Role::whereIn("id", $ids)->update([
            "is_active" => true
        ]);

        if ($updated > 0) {
            return response()->json([
                "message" => "Selected items deactivated successfully.",
                "count" => $updated,
                "status" => 200
            ], 200);
        }

        return response()->json([
            "message" => "Failed to deactivate roles. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:roles,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid roles IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Role::whereIn("id", $ids)->update([
            "is_active" => false
        ]);

        if ($updated > 0) {
            return response()->json([
                "message" => "Selected items activated successfully.",
                "count" => $updated,
                "status" => 200
            ], 200);
        }

        return response()->json([
            "message" => "Failed to activate roles. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function activeDeactivate(Request $request): JsonResponse
    {
        $id = $request->input("id");
        $is_active = $request->input("is_active");

        $updated = Role::where("id", $id)->update([
            "is_active" => $is_active
        ]);

        if ($updated > 0) {
            return response()->json([
                "message" => "Selected items activated successfully.",
                "count" => $updated,
                "status" => 200
            ], 200);
        }

        return response()->json([
            "message" => "Failed to activate roles. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }
}
