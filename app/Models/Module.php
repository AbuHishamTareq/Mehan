<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Module extends Model
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $table = "modules";

    protected $fillable = [
        "label"
    ];

    public function permissions()
    {
        return $this->hasMany(Permission::class, 'module_id');
    }
}
