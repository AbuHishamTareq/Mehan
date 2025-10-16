<?php

namespace App\Imports;

use App\Models\Department;
use App\Models\Designation;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DesignationImport implements
    ToModel,
    WithHeadingRow,
    SkipsOnError,
    SkipsOnFailure,
    WithBatchInserts,
    WithChunkReading
{
    use Importable, SkipsErrors, SkipsFailures;

    private int $importedCount = 0;
    private int $skippedCount = 0;
    private array $customErrors = [];

    /**
     * Map each Excel row to a Department model
     */
    public function model(array $row)
    {
        try {
            $normalizedRow = [];
            foreach ($row as $key => $value) {
                $cleanKey = str_replace("\xC2\xA0", ' ', $key);
                $cleanKey = trim(str_replace('*', '', $cleanKey));
                $cleanKey = strtolower($cleanKey);
                $normalizedRow[$cleanKey] = trim($value);
            }

            info('Normalized Row:', $normalizedRow);

            $en = $normalizedRow['english_name'] ?? $normalizedRow['english name'] ?? null;
            $ar = $normalizedRow['arabic_name'] ?? $normalizedRow['arabic name'] ?? null;
            $department = $normalizedRow['department'] ?? null;

            info("Mapped => English: {$en}, Arabic: {$ar}, Department: {$department}");

            if (empty($en) || empty($ar) || empty($department)) {
                $this->skippedCount++;
                $this->customErrors[] = "Row skipped: missing required fields.";
                return null;
            }

            // Get department ID
            $department_id = Department::where('en_name', 'like', "%{$department}%")->value("id");

            if ($department_id) {
                $designation = Designation::updateOrCreate(
                    ['en_name' => $en, 'department_id' => $department_id],
                    [
                        'ar_name' => $ar,
                        'is_active' => true,
                        'created_by' => Auth::id(),
                    ]
                );

                $this->importedCount++;
                return $designation;
            } else {
                $this->skippedCount++;
                $this->customErrors[] = "Department not found: {$department}";
                return null;
            }
        } catch (\Exception $e) {
            $this->skippedCount++;
            $this->customErrors[] = "Error: " . $e->getMessage();
            info('Import error:', ['exception' => $e->getMessage()]);
            return null;
        }
    }

    public function headingRow(): int
    {
        return 1;
    }

    public function batchSize(): int
    {
        return 100;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function getImportStats(): array
    {
        return [
            'imported'        => $this->importedCount,
            'skipped'         => $this->skippedCount,
            'errors'          => $this->customErrors,
            'total_processed' => $this->importedCount + $this->skippedCount,
        ];
    }
}
