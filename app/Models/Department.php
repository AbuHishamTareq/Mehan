<?php

namespace App\Models;

use App\Traits\BlameableSoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Department extends Model
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles, SoftDeletes, BlameableSoftDeletes;

    protected $table = "departments";

    protected $fillable = [
        'en_name',
        'ar_name',
        'is_active',
        'created_by',
        'updated_by',
        'removed_by',
        'restored_by',
        'removed_at',
    ];

    protected $dates = ['removed_at'];
    const DELETED_AT = 'removed_at';

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
        return $this->belongsTo(User::class, "removed_by");
    }

    // Users who updated this department
    public function restorer()
    {
        return $this->belongsTo(User::class, "restored_by");
    }
}
