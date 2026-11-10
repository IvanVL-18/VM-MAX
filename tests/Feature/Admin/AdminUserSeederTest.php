<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('isp.super_admin', [
            'nombre' => 'Super Admin',
            'email' => 'super@ejemplo.mx',
            'password' => 'secreto-de-prueba',
        ]);
    }

    public function test_crea_al_super_administrador_con_las_credenciales_configuradas(): void
    {
        $this->seed(AdminUserSeeder::class);

        $admin = User::query()->where('email', 'super@ejemplo.mx')->sole();

        $this->assertSame('Super Admin', $admin->name);
        $this->assertTrue(Hash::check('secreto-de-prueba', $admin->password));
        $this->assertNotNull($admin->email_verified_at);
    }

    public function test_no_duplica_ni_modifica_al_super_administrador_existente(): void
    {
        $this->seed(AdminUserSeeder::class);

        config()->set('isp.super_admin.password', 'otra-contrasena');
        $this->seed(AdminUserSeeder::class);

        $this->assertSame(1, User::query()->where('email', 'super@ejemplo.mx')->count());
        $this->assertTrue(Hash::check(
            'secreto-de-prueba',
            User::query()->where('email', 'super@ejemplo.mx')->sole()->password,
        ));
    }
}
