<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Permission::query()->with("module");

        if ($search = $request->query("search")) {
            $query->where(function ($q) use ($search) {
                $q->where("label", "like", "%{$search}%")
                    ->orWhere("description", "like", "%{$search}%")
                    ->orWhereHas("module", function ($mq) use ($search) {
                        $mq->where("label", "like", "%{$search}%");
                    });
            });
        }

        $perPage = $request->query("perPage", 10);

        if ($perPage == -1) {
            $allPermissions = $query->orderBy("created_at", "DESC")->get();

            $permissions = new LengthAwarePaginator(
                $allPermissions,
                $allPermissions->count(),
                $allPermissions->count(),
                1, // current page
                ['path' => $request->url(), 'query' => $request->query()]
            );
        } else {
            $permissions = $query->orderBy("created_at", "DESC")->paginate($perPage);
        }

        $permissions = $permissions->through(function ($permission) {
            return [
                "id" => $permission->id,
                "label" => $permission->label,
                "name" => $permission->name,
                "module_id" => $permission->module_id,
                "description" => $permission->description,
                "is_active" => $permission->is_active,
                "module" => $permission->module->label,
            ];
        });

        $modules = Module::all()->map(function ($module) {
            return [
                "label"    => $module->label,
                "value" => $module->id,
                "key" => $module->id,
            ];
        });

        return response()->json([
            "permissions" => $permissions,
            "modules" => $modules
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            "module" => "required|integer|exists:modules,id",
            "label" => "required|string"
        ]);

        Permission::create([
            "module_id" => $request->input("module"),
            "label" => $request->input("label"),
            "name" => Str::slug($request->input("label"), "_"),
            "description" => $request->input("description") ?? null,
            "is_active" => $request->input("is_active") ?? true,
        ]);

        return response()->json([
            "message" => "Permission created successfully",
            "status" => 201 // HTTP status code for Created
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            "module" => "required|integer|exists:modules,id",
            "label" => "required|string"
        ]);

        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                "message" => "Permission not found",
                "status" => 404
            ], 404);
        }

        $permission->module_id = $request->input("module");
        $permission->label = $request->input("label");
        $permission->description = $request->input("description") ?? null;
        $permission->save();

        return response()->json([
            "message" => "Permission updated successfully",
            "status" => 200
        ], 200);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:permissions,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid permissions IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Permission::whereIn("id", $ids)->update([
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
            "message" => "Failed to deactivate permissions. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:permissions,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid permissions IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Permission::whereIn("id", $ids)->update([
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
            "message" => "Failed to activate permissions. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function activeDeactivate(Request $request): JsonResponse
    {
        $id = $request->input("id");
        $is_active = $request->input("is_active");

        $updated = Permission::where("id", $id)->update([
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
            "message" => "Failed to activate permissions. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }
}
