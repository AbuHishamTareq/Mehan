<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Department
        DB::table('departments')->insert([
            'en_name' => 'Information Technology',
            'ar_name' => 'تقنية المعلومات',
            'created_at' => now(),
        ]);
    }
}
