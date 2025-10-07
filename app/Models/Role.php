<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $table = "roles";

    protected $fillable = [
        "name",
        "label",
        "description",
        "is_active",
        "guard_name"
    ];

    protected $attributes = [
        'guard_name' => 'sanctum',
    ];
}
