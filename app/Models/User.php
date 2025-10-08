<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        "name",
        "email",
        "password",
        "mobile_number",
        "status",
        "uuid",
        "department_id",
        "desgnation_id",
        "created_by",
        "updated_by",
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        "password",
        "remember_token",
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }

    // Automatically generate UUID on creating a user
    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    // Relations //

    // Department of the user
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Designation of the user
    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    // Creator relation
    public function creator()
    {
        return $this->belongsTo(User::class, "created_by");
    }

    // Updater relation
    public function updater()
    {
        return $this->belongsTo(User::class, "updated_by");
    }

    // Destroyer relation
    public function destroyer()
    {
        return $this->belongsTo(User::class, "removed_by");
    }

    // Destroyer relation
    public function restorer()
    {
        return $this->belongsTo(User::class, "restored_by");
    }
}
