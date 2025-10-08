<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

trait BlameableSoftDeletes
{
    protected static array $softDeleteColumnsCache = [];

    public static function bootBlameableSoftDeletes()
    {
        static::deleting(function (Model $model) {
            if (Auth::check() && !$model->isForceDeleting()) {

                if (self::hasColumn($model, 'removed_by')) {
                    $model->removed_by = Auth::id();
                }

                if (self::hasColumn($model, 'is_active')) {
                    $model->is_active = false;
                }

                $model->saveQuietly();
            }
        });

        static::restoring(function (Model $model) {
            if (Auth::check()) {
                if (self::hasColumn($model, 'removed_by')) {
                    $model->removed_by = null;
                    $model->restored_by = Auth::id();
                }

                if (self::hasColumn($model, 'is_active')) {
                    $model->is_active = true;
                }

                $model->saveQuietly();
            }
        });
    }

    protected static function hasColumn(Model $model, string $column): bool
    {
        $table = $model->getTable();

        if (!isset(self::$softDeleteColumnsCache[$table])) {
            self::$softDeleteColumnsCache[$table] = collect(Schema::getColumnListing($table))->flip()->all();
        }

        return isset(self::$softDeleteColumnsCache[$table][$column]);
    }
}
