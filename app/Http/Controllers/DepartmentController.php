<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Department::query();

        if ($search = $request->query('search')) {
            $query->where("en_name", "ilike", "%{$search}%")
                ->orWhere("ar_name", "ilike", "%{$search}%");
        }

        $perPage = $request->query('perPage', 10);

        $departments = $query->orderBy("created_at", "DESC")->paginate($perPage);

        $departments = $departments->through(function ($department) {
            return [
                "id" => $department->id,
                "en_name" => $department->en_name,
                "ar_name" => $department->ar_name,
                "is_active" => $department->is_active,
                "is_deleted" => $department->is_deleted,
                "deleted" => $department->is_deleted === true ? "Yes" : "No",
            ];
        });

        return response()->json([
            "departments" => $departments
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            "en_name" => "required|string",
            "ar_name" => "required|string"
        ]);

        Department::create([
            "en_name" => $request->input("en_name"),
            "ar_name" => $request->input("ar_name"),
            "is_active" => $request->input("is_active") ?? true,
            "is_deleted" => $request->input("is_deleted") ?? false,
            "created_by" => Auth::id()
        ]);

        return response()->json([
            "message" => "Department created successfully",
            "status" => 201 // HTTP status code for Created
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            "en_name" => "required|string",
            "ar_name" => "required|string"
        ]);

        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                "message" => "Department not found",
                "status" => 404
            ], 404);
        }

        $department->en_name = $request->input("en_name");
        $department->ar_name = $request->input("ar_name");
        $department->updated_by = Auth::id();
        $department->save();

        return response()->json([
            "message" => "Department updated successfully",
            "status" => 200
        ], 200);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:departments,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid department IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Department::whereIn("id", $ids)->update([
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
            "message" => "Failed to deactivate departments. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:departments,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid department IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Department::whereIn("id", $ids)->update([
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
            "message" => "Failed to activate departments. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function activeDeactivate(Request $request): JsonResponse
    {
        $id = $request->input("id");
        $is_active = $request->input("is_active");

        $updated = Department::where("id", $id)->update([
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
            "message" => "Failed to activate departments. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function destroy($id): JsonResponse
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                "message" => "Department not found !",
                "status" => 404
            ], 404);
        }

        $updated = Department::where("id", $id)->update([
            "is_active" => false,
            "is_deleted" => true,
            "deleted_by" => Auth::id()
        ]);

        return response()->json([
            "message" => "Department deleted Successfully !",
            "status" => 200
        ], 200);
    }
}
