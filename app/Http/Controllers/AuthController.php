<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Get(path: "/login", tags: ["AuthController"], summary: "Login to SAAT CRM", description: "Login", responses: [ new OA\Response(response: 200, description: "User logged in successfully")])]
    public function login(Request $request) : JsonResponse {
        App::setLocale($request->language ?? 'en');
        $credentials = $request->validate(
            [
                "email" => "required|string|email",
                "password" => "required|string",
            ],
            [
                "email" => __("validation.attributes.email"),
                "password" => __("validation.attributes.password"),
            ]
        );

        $remember = $credentials['remember'] ?? false;

        unset($credentials['remember']);

        if(!Auth::attempt($credentials, $remember)) {
            return response()->json([
                "error" => __("auth.failed"),
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            "success" => __("auth.login")
        ]);
    }
}
