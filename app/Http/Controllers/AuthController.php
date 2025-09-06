<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Get(path: "/users", tags: ["AuthController"], summary: "Get all users", description: "List of users", responses: [ new OA\Response(response: 200, description: "User retrieved successfully")])]
    public function index() : JsonResponse {
        $users = User::all();

        return response()->json([
            'users' => $users,
            'message' => "Fetch Users Working Successfully"
        ]);
    }
}
