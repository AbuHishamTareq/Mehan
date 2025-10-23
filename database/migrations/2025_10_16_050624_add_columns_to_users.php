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
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn("users", "status")) {
                try {
                    $table->dropIndex(["status"]);
                } catch (\Exception $e) {
                    // Ignore if index doesn't exist
                }
                $table->dropColumn("status");
            }

            if (Schema::hasColumn("users", "is_deleted")) {
                try {
                    $table->dropIndex(["is_deleted"]);
                } catch (\Exception $e) {
                    // Ignore if index doesn't exist
                }
                $table->dropColumn("is_deleted");
            }

            $table->boolean("is_active")->default(true)->after("mobile_number");
            $table->integer("removed_by")->nullable();
            $table->integer("restored_by")->nullable();
            $table->softDeletes("removed_at");
            $table->index("is_active");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn("users", "is_active")) {
                $table->dropIndex(["is_active"]);
                $table->dropColumn("is_active");
            }

            if (Schema::hasColumn("users", "removed_by")) {
                $table->dropColumn("removed_by");
            }

            if (Schema::hasColumn("users", "restored_by")) {
                $table->dropColumn("restored_by");
            }

            if (Schema::hasColumn("users", "removed_at")) {
                $table->dropColumn("removed_at");
            }

            $table->enum("status", ["active", "inactive"])->default("active")->after("mobile_number");
            $table->enum('is_delated', ['yes', 'no'])->default('no');

            $table->index("status");
            $table->index('is_delated');
        });
    }
};
