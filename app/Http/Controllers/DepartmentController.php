<?php

namespace App\Http\Controllers;

use App\Imports\DepartmentsImport;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Department::withTrashed();

        if ($search = $request->query('search')) {
            $query->where("en_name", "like", "%{$search}%")
                ->orWhere("ar_name", "like", "%{$search}%");
        }

        $perPage = $request->query('perPage', 10);

        if ($perPage == -1) {
            $allDepartments = $query->orderBy("created_at", "DESC")->get();

            $departments = new LengthAwarePaginator(
                $allDepartments,
                $allDepartments->count(),
                $allDepartments->count(),
                1, // current page
                ['path' => $request->url(), 'query' => $request->query()]
            );
        } else {
            $departments = $query->orderBy("created_at", "DESC")->paginate($perPage);
        }

        $departments = $departments->through(function ($department) {
            return [
                "id" => $department->id,
                "en_name" => $department->en_name,
                "ar_name" => $department->ar_name,
                "is_active" => $department->is_active,
                "removed_at" => $department->removed_at,
                "removed" => $department->removed_at ? "Yes" : "No"
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

        $department = Department::create([
            "en_name" => $request->input("en_name"),
            "ar_name" => $request->input("ar_name"),
            "is_active" => $request->input("is_active") ?? true,
            "created_by" => Auth::id()
        ]);

        if ($department) {
            return response()->json([
                "message" => "Department created successfully",
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

        $updated = Department::whereIn("id", $ids)->whereNull("removed_at")->update([
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
            "message" => "Failed to activate departments. Please try again later.",
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

        $updated = Department::whereIn("id", $ids)->whereNull("removed_at")->update([
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
            "message" => "Failed to deactivate departments. Please try again later.",
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

        $department->delete();

        return response()->json([
            "message" => "Department deleted successfully !",
            "status" => 200
        ], 200);
    }

    public function restore($id): JsonResponse
    {
        $department = Department::withTrashed()->find($id);

        if (!$department) {
            return response()->json([
                "message" => "Department not found !",
                "status" => 404
            ], 404);
        }

        $department->restore();

        return response()->json([
            "message" => "Department restored successfully !",
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
            $import = new DepartmentsImport;

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
            "message" => "Failed to import departmens data. Please try again later.",
            "status" => 500
        ], 500);
    }
}
