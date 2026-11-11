<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdmin extends Command
{
    protected $signature = 'app:create-admin {email} {name}';

    protected $description = 'Create or update an administrator account';

    public function handle(): int
    {
        $email = strtolower((string) $this->argument('email'));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Enter a valid email address.');

            return self::INVALID;
        }
        $name = trim((string) $this->argument('name'));
        if ($name === '' || strlen($name) > 190) {
            $this->error('Enter a name between 1 and 190 characters.');

            return self::INVALID;
        }

        $password = $this->secret('Set a strong administrator password (12 to 72 bytes).');
        $confirmed = $this->secret('Confirm the password.');
        if (! is_string($password) || strlen($password) < 12 || strlen($password) > 72 || ! hash_equals($password, (string) $confirmed)) {
            $this->error('Passwords must match and contain 12 to 72 bytes.');

            return self::FAILURE;
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            ['name' => $name, 'password' => Hash::make($password), 'is_admin' => true],
        );
        $this->info('Administrator account saved.');

        return self::SUCCESS;
    }
}
