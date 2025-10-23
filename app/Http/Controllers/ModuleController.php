<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ModuleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Module::query();

        if ($search = $request->query('search')) {
            $query->where("label", "like", "%{$search}%");
        }

        $perPage = $request->query('perPage', 10);

        if ($perPage == -1) {
            $allModules = $query->orderBy("created_at", "DESC")->get();

            $modules = new LengthAwarePaginator(
                $allModules,
                $allModules->count(),
                $allModules->count(),
                1, // current page
                ['path' => $request->url(), 'query' => $request->query()]
            );
        } else {
            $modules = $query->orderBy("created_at", "DESC")->paginate($perPage);
        }

        return response()->json([
            "modules" => $modules
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            "label" => "required|string"
        ]);

        Module::create([
            "label" => $request->input("label")
        ]);

        return response()->json([
            "message" => "Module created successfully",
            "status" => 201 // HTTP status code for Created
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            "label" => "required|string"
        ]);

        $module = Module::find($id);

        if (!$module) {
            return response()->json([
                "message" => "Module not found",
                "status" => 404
            ], 404);
        }

        $module->label = $request->input("label");
        $module->save();

        return response()->json([
            "message" => "Module updated successfully",
            "status" => 200
        ], 200);
    }
}
