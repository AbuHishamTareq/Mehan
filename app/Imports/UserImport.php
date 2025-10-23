<?php

namespace App\Imports;

use App\Models\Department;
use App\Models\Designation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UserImport implements
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

            $name = $normalizedRow['name'] ?? $normalizedRow['name'] ?? null;
            $email = $normalizedRow['email'] ?? $normalizedRow['email'] ?? null;
            $password = $normalizedRow['password'] ?? $normalizedRow['password'] ?? null;
            $department = $normalizedRow['department'] ?? $normalizedRow['department'] ?? null;
            $designation = $normalizedRow['designation'] ?? $normalizedRow['designation'] ?? null;
            $mobile = $normalizedRow['mobile_number'] ?? $normalizedRow['mobile number'] ?? null;
            $role = $normalizedRow['role'] ?? $normalizedRow['role'] ?? null;

            info("Mapped => Name: {$name}, Email: {$email}, Password: {$password}, Department: {$department}, Designation: {$designation}, Mobile: {$mobile}, Role: {$role}");

            if (empty($name) || empty($email) || empty($password) || empty($department) || empty($designation) || empty($mobile) || empty($role)) {
                $this->skippedCount++;
                $this->customErrors[] = "Row skipped: missing required fields.";
                return null;
            }

            // Get department ID
            $department_id = Department::where('en_name', 'like', "%{$department}%")->value("id");

            // Get designation ID
            $designation_id = Designation::where('en_name', 'like', "%{$designation}%")->value("id");

            // Get role name
            $role_name = Role::where('name', 'like', "%{$role}%")->value("name");

            if ($department_id) {
                $user = User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'password' => Hash::make($password),
                        'department_id' => $department_id,
                        'designation_id' => $designation_id,
                        'mobile_number' => $mobile,
                        'is_active' => true,
                        'created_by' => Auth::id(),
                    ]
                );

                $user->syncRoles($role);

                $this->importedCount++;
                return $user;
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
