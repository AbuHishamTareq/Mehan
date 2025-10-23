<?php

namespace App\Http\Controllers;

use App\Imports\UserImport;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::withTrashed()->with(["department", "designation", "roles"]);

        if ($search = $request->query("search")) {
            $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%{$search}%")
                    ->orWhere("email", "like", "%{$search}%")
                    ->orWhere("mobile_number", "like", "%{$search}%")
                    ->orWhereHas("designation", function ($mq) use ($search) {
                        $mq->where("en_name", "like", "%{$search}%");
                    });
            });
        }

        $perPage = $request->query("perPage", 10);

        if ($perPage == -1) {
            $allUsers = $query->orderBy("created_at", "DESC")->get();

            $users = new LengthAwarePaginator(
                $allUsers,
                $allUsers->count(),
                $allUsers->count(),
                1, // current page
                ['path' => $request->url(), 'query' => $request->query()]
            );
        } else {
            $users = $query->orderBy("created_at", "DESC")->paginate($perPage);
        }

        $users = $users->through(function ($user) {
            return [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "password" => $user->password,
                "mobile_number" => $user->mobile_number,
                "department_id" => $user->department_id,
                "designation_id" => $user->designation_id,
                "is_active" => $user->is_active,
                "department" => $user->department->en_name,
                "designation" => $user->designation->en_name,
                "removed_at" => $user->removed_at,
                "removed" => $user->removed_at ? "Yes" : "No",
                "roles" => $user->roles->pluck('name'),
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

        $designations = Designation::where('is_active', true)
            ->get() // Use get() to get a Collection
            ->map(function ($designation) {
                return [
                    "label" => $designation->en_name . " (" . $designation->ar_name . ")",
                    "value" => $designation->id,
                    "key"   => $designation->id,
                ];
            });

        $roles = Role::where('is_active', true)
            ->get() // Use get() to get a Collection
            ->map(function ($role) {
                return [
                    "label" => $role->label,
                    "value" => $role->name,
                    "key"   => $role->id,
                ];
            });

        return response()->json([
            "users" => $users,
            "departments" => $departments,
            "designations" => $designations,
            "roles" => $roles,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            "name" => "required|string",
            "email" => "required|string",
            "password" => "required|string",
            "department" => "required|numeric",
            "designation" => "required|numeric",
            "mobile_number" => "required|string",
        ]);

        $user = User::create([
            "name" => $request->input("name"),
            "email" => $request->input("email"),
            "password" => Hash::make($request->input("password")),
            "department_id" => $request->input("department"),
            "designation_id" => $request->input("designation"),
            "mobile_number" => $request->input("mobile_number"),
            "is_active" => $request->input("is_active") ?? true,
            "created_by" => Auth::id()
        ]);

        if ($user) {
            $user->syncRoles($request->input('role', []));
            return response()->json([
                "message" => "User created successfully",
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
            "name" => "required|string",
            "email" => "required|string",
            "password" => "required|string",
            "department" => "required|numeric",
            "designation" => "required|numeric",
            "mobile_number" => "required|string",
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                "message" => "User not found",
                "status" => 404
            ], 404);
        }

        $user->name = $request->input("name");
        $user->email = $request->input("email");
        $user->department_id = $request->input("department");
        $user->designation_id = $request->input("designation");
        $user->mobile_number = $request->input("mobile_number");
        $user->updated_by = Auth::id();
        $user->save();

        $user->syncRoles($request->input('role', []));

        return response()->json([
            "message" => "User updated successfully",
            "status" => 200
        ], 200);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:users,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid user IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = User::whereIn("id", $ids)->whereNull("removed_at")->update([
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
            "message" => "Failed to activate users. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "ids" => "required|array|min:1",
            "ids.*" => "integer|exists:users,id"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "Invalid user IDs provided.",
                "details" => $validator->errors(),
                "status" => 422
            ], 422);
        }

        $ids = $request->input("ids");

        $updated = User::whereIn("id", $ids)->whereNull("removed_at")->update([
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
            "message" => "Failed to deactivate users. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function activeDeactivate(Request $request): JsonResponse
    {
        $id = $request->input("id");
        $is_active = $request->input("is_active");

        $updated = User::where("id", $id)->update([
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
            "message" => "Failed to activate users. Please try again later.",
            "count" => 0,
            "status" => 500
        ], 500);
    }

    public function destroy($id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                "message" => "User not found !",
                "status" => 404
            ], 404);
        }

        $user->delete();

        return response()->json([
            "message" => "User deleted successfully !",
            "status" => 200
        ], 200);
    }

    public function restore($id): JsonResponse
    {
        $user = User::withTrashed()->find($id);

        if (!$user) {
            return response()->json([
                "message" => "User not found !",
                "status" => 404
            ], 404);
        }

        $user->restore();

        return response()->json([
            "message" => "User restored successfully !",
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
            $import = new UserImport;

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
            "message" => "Failed to import users data. Please try again later.",
            "status" => 500
        ], 500);
    }
}
