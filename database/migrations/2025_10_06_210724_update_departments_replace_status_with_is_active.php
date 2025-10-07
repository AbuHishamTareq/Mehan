<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            if (Schema::hasColumn('departments', 'status')) {
                try {
                    $table->dropIndex(['status']);
                } catch (\Exception $e) {
                    // Ignore if index doesn't exist
                }
                $table->dropColumn('status');
            }

            $table->boolean('is_active')->default(true)->after('ar_name');
            $table->boolean('is_deleted')->default(false)->after('is_active');
            $table->integer('deleted_by')->nullable();
            $table->index('is_active');
            $table->index('is_deleted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            if (Schema::hasColumn('departments', 'is_active')) {
                $table->dropIndex(['is_active']);
                $table->dropColumn('is_active');
            }

            if (Schema::hasColumn('departments', 'is_deleted')) {
                $table->dropIndex(['is_deleted']);
                $table->dropColumn('is_deleted');
            }

            if (Schema::hasColumn('departments', 'deleted_by')) {
                $table->dropColumn('deleted_by');
            }

            $table->enum('status', ['active', 'inactive'])->default('active')->after('ar_name');
            $table->index('status');
        });
    }
};
