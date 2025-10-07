<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Department extends Model
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $table = "departments";

    protected $fillable = [
        "en_name",
        "ar_name",
        "status",
        "created_by",
        "updated_by",
    ];

    // Relations //

    // Designations in this department
    public function designations()
    {
        return $this->hasMany(Designation::class);
    }

    // Users in this department
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Users who created this department
    public function creator()
    {
        return $this->belongsTo(User::class, "created_by");
    }

    // Users who updated this department
    public function updater()
    {
        return $this->belongsTo(User::class, "updated_by");
    }

    // Users who updated this department
    public function destroyer()
    {
        return $this->belongsTo(User::class, "deleted_by");
    }
}
