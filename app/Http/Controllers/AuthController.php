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
    #[OA\Get(path: "/login", tags: ["Backend APIs (Auth Controller)"], summary: "Login to SAAT CRM", description: "Login", responses: [new OA\Response(response: 200, description: "User logged in successfully")])]
    public function login(Request $request): JsonResponse
    {
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

        $remember = $credentials["remember"] ?? false;

        unset($credentials["remember"]);

        if (!Auth::attempt($credentials, $remember)) {
            return response()->json([
                "error" => __("auth.failed"),
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            "success" => __("auth.login"),
            "user" => [
                "id"    => Auth::id(),
                "name"  => Auth::user()->name,
                "email" => Auth::user()->email,
                "roles"  => Auth::user()->roles ?? null,
                "permissions" => Auth::user()->permissions ?? null,
            ],
        ]);
    }

    #[OA\Get(path: "/logout", tags: ["Backend APIs (Auth Controller)"], summary: "Logout from SAAT CRM", description: "Logout", responses: [new OA\Response(response: 200, description: "User logged out successfully")])]
    public function logout(Request $request): JsonResponse
    {
        App::setLocale($request->lang ?? "en");

        Auth::guard("web")->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            "message" => __("auth.logout"),
        ]);
    }
}
