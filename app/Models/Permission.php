<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $table = "permissions";

    protected $fillable = [
        "module_id",
        "name",
        "label",
        "description",
        "is_active",
        "guard_name"
    ];

    protected $attributes = [
        'guard_name' => 'sanctum',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
