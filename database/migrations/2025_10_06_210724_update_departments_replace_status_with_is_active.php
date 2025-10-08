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
        Schema::table("departments", function (Blueprint $table) {
            if (Schema::hasColumn("departments", "status")) {
                try {
                    $table->dropIndex(["status"]);
                } catch (\Exception $e) {
                    // Ignore if index doesn't exist
                }
                $table->dropColumn("status");
            }

            $table->boolean("is_active")->default(true)->after("ar_name");
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
        Schema::table("departments", function (Blueprint $table) {
            if (Schema::hasColumn("departments", "is_active")) {
                $table->dropIndex(["is_active"]);
                $table->dropColumn("is_active");
            }

            if (Schema::hasColumn("departments", "removed_by")) {
                $table->dropColumn("removed_by");
            }

            if (Schema::hasColumn("departments", "restored_by")) {
                $table->dropColumn("restored_by");
            }

            if (Schema::hasColumn("departments", "removed_at")) {
                $table->dropColumn("removed_at");
            }

            $table->enum("status", ["active", "inactive"])->default("active")->after("ar_name");
            $table->index("status");
        });
    }
};
