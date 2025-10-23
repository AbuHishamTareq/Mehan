<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Department
        DB::table('designations')->insert([
            'en_name' => 'Mobile Developer',
            'ar_name' => 'مطور تطبيقات جوال',
            'department_id' => 1,
            'created_at' => now(),
        ]);
    }
}
