<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[
    OA\Info(version: "1.0.0", title: "Mehan API Documentation", description: "API Documentation", contact: new OA\Contact(email: "mob.dev@mehan.sa")),
    OA\Server(url: "http://localhost:8000/api", description: "localhost"),
    OA\SecurityScheme(securityScheme: "bearerAuth", type: "http", name: "Authorization", in: "header", scheme: "bearer")
]

abstract class Controller
{
    //
}
