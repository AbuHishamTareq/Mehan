<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
            $table->unsignedBigInteger('department_id')->nullable()->after('password');
            $table->unsignedBigInteger('designation_id')->nullable()->after('department_id');
            $table->string('mobile_number')->nullable()->after('designation_id');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('mobile_number');
            $table->unsignedBigInteger('created_by')->nullable()->after('created_at');
            $table->unsignedBigInteger('updated_by')->nullable()->after('updated_at');
            $table->enum('is_delated', ['yes', 'no'])->default('no');

            // Indexes
            $table->index('status');
            $table->index('is_delated');
            $table->index(['created_by', 'updated_by']);

            // Foreign keys
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
            $table->foreign('designation_id')->references('id')->on('designations')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });

        // Backfill existing users
        DB::table('users')->whereNull('uuid')->get()->each(function ($user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['uuid' => (string) Str::uuid()]);
        });

        // Ensure it's non-null going forward
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['department_id']);
            $table->dropForeign(['designation_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);

            // Drop indexes
            $table->dropIndex(['status']);
            $table->dropIndex(['is_delated']);
            $table->dropIndex(['created_by', 'updated_by']);

            // Drop columns
            $table->dropColumn([
                'uuid',
                'department_id',
                'designation_id',
                'mobile_number',
                'status',
                'created_by',
                'updated_by',
                'is_delated',
            ]);
        });
    }
};
