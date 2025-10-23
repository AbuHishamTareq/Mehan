<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $adminExists = DB::table('users')->where('email', 'mob.dev@mehan.sa')->exists();
        if ($adminExists) {
            $this->command->info('Admin user already exists. Skipping.');
            return;
        }

        // Create admin user
        DB::table('users')->insert([
            'uuid' => (string) Str::uuid(),
            'name' => 'Tareq Abdulrahman Dheeb',
            'email' => 'mob.dev@mehan.sa',
            'email_verified_at' => now(),
            'password' => Hash::make('M3h@n@2025'), // change to secure password
            'remember_token' => Str::random(10),
            'department_id' => 1,
            'designation_id' => 1,
            'mobile_number' => '0551977904',
            'created_at' => now(),
        ]);
    }
}
