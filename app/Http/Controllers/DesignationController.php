<?php

namespace App\Http\Controllers;

use App\Imports\DesignationImport;
use App\Imports\ResignationImport;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class DesignationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Designation::withTrashed()->with("department");

        if ($search = $request->query("search")) {
            $query->where(function ($q) use ($search) {
                $q->where("en_name", "like", "%{$search}%")
                    ->orWhere("en_name", "like", "%{$search}%")
                    ->orWhereHas("department", function ($mq) use ($search) {
                        $mq->where("en_name", "like", "%{$search}%");
                    });
            });
        }

        $perPage = $request->query("perPage", 10);

        $designations = $query->orderBy("created_at", "DESC")->paginate($perPage);

        $designations = $designations->through(function ($designation) {
            return [
                "id" => $designation->id,
                "en_name" => $designation->en_name,
                "ar_name" => $designation->ar_name,
                "department_id" => $designation->department_id,
                "is_active" => $designation->is_active,
                "department" => $designation->department->en_name,
                "removed_at" => $designation->removed_at,
                "removed" => $designation->removed_at ? "Yes" : "No"
            ];
        });

        $departments = Department::where('is_active', true)
            ->get() // Use get() to get a Collection
            ->map(function ($department) {
                return [
                    "label" => $department->en_name . " (" . $department->ar_name . ")",
                    "value" => $department->id,
                    "key"   => $department->id,
                ];
            });

        return response()->json([
            "designations" => $designations,
            "departments" => $departments
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            "en_name" => "required|string",
            "ar_name" => "required|string",
            "department" => "required|numeric",
        ]);

        $designation = Designation::create([
            "en_name" => $request->input("en_name"),
            "ar_name" => $request->input("ar_name"),
            "department_id" => $request->input("department"),
            "is_active" => $request->input("is_active") ?? true,
            "created_by" => Auth::id()
        ]);

        if ($designation) {
            return response()->json([
                "message" => "Designation created successfully",
                "status" => 201 // HTTP status code for Created
            ], 201);
        }

        return response()->json([
            "message" => "Something went wrong",
            "status" => 500 // HTTP status code for Created
        ], 500);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            "en_name" => "required|string",
            "ar_name" => "required|string",
            "department" => "required|numeric",
        ]);

        $designation = Designation::find($id);

        if (!$designation) {
            return response()->json([
                "message" => "Designation not found",
                "status" => 404
            ], 404);
        }

        $designation->en_name = $request->input("en_name");
        $designation->ar_name = $request->input("ar_name");
        $designation->department_id = $request->input("department");
        $designation->updated_by = Auth::id();
        $designation->save();

        return response()->json([
            "message" => "Designation updated successfully",
            "status" => 200
        ], 200);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:designations,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid designation IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Designation::whereIn("id", $ids)->whereNull("removed_at")->update([
            "is_active" => true
        ]);

        if ($updated > 0) {
            return response()->json([
                "message" => "Selected items activate successfully.",
                "count" => $updated,
                "status" => 200
            ], 200);
        }

        return response()->json([
            "message" => "Failed to activate designations. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:designations,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid designation IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = Designation::whereIn("id", $ids)->whereNull("removed_at")->update([
            "is_active" => false
        ]);

        if ($updated > 0) {
            return response()->json([
                "message" => "Selected items deactivated successfully.",
                "count" => $updated,
                "status" => 200
            ], 200);
        }

        return response()->json([
            "message" => "Failed to deactivate designations. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function activeDeactivate(Request $request): JsonResponse
    {
        $id = $request->input("id");
        $is_active = $request->input("is_active");

        $updated = Designation::where("id", $id)->update([
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
            "message" => "Failed to activate designations. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function destroy($id): JsonResponse
    {
        $designation = Designation::find($id);

        if (!$designation) {
            return response()->json([
                "message" => "Designation not found !",
                "status" => 404
            ], 404);
        }

        $designation->delete();

        return response()->json([
            "message" => "Designation deleted successfully !",
            "status" => 200
        ], 200);
    }

    public function restore($id): JsonResponse
    {
        $designation = Designation::withTrashed()->find($id);

        if (!$designation) {
            return response()->json([
                "message" => "Designation not found !",
                "status" => 404
            ], 404);
        }

        $designation->restore();

        return response()->json([
            "message" => "Designation restored successfully !",
            "status" => 200
        ], 200);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:10240',
        ]);

        try {
            $file = $request->file("file");
            $import = new DesignationImport;

            Excel::import($import, $file);

            $stats = $import->getImportStats();

            $failures = $import->failures();
            $errors = $import->errors();

            $response = [
                'message' => 'Import completed successfully!',
                'stats' => $stats,
                'imported_count' => $stats['imported'],
                'skipped_count' => $stats['skipped'],
                'total_processed' => $stats['total_processed']
            ];

            // Add errors if any
            if (!empty($errors) || !empty($failures)) {
                $response['warnings'] = [];

                // Add custom errors
                if (!empty($stats['errors'])) {
                    $response['warnings'] = array_merge($response['warnings'], $stats['errors']);
                }

                // Add validation failures
                foreach ($failures as $failure) {
                    $response['warnings'][] = "Row {$failure->row()}: " . implode(', ', $failure->errors());
                }
            }

            info($response);

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Something went wrong: " . $e,
                "status" => 500
            ], 500);
        }
        return response()->json([
            "message" => "Failed to import designations data. Please try again later.",
            "status" => 500
        ], 500);
    }
}
