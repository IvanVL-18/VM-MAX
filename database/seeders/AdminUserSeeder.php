<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Crea el super administrador. El registro publico esta deshabilitado, asi que
 * esta es la unica via junto con el comando `php artisan isp:crear-admin`.
 *
 * Las credenciales salen de `config/isp.php` (`isp.super_admin`), que a su vez
 * permite sobrescribirlas con ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_NAME.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = config()->string('isp.super_admin.email');

        if (User::query()->where('email', $email)->exists()) {
            $this->command->warn("El administrador {$email} ya existe. No se modificó.");

            return;
        }

        User::query()->create([
            'name' => config()->string('isp.super_admin.nombre'),
            'email' => $email,
            'password' => Hash::make(config()->string('isp.super_admin.password')),
            'email_verified_at' => now(),
        ]);

        $this->command->info("Administrador creado: {$email}");
    }
}
