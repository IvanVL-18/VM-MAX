<?php

namespace Tests\Feature\Admin;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanCrudTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    /** @return array<string, mixed> */
    private function datosValidos(array $sobrescribir = []): array
    {
        return array_merge([
            'nombre' => 'Plan Hogar 100',
            'tecnologia' => 'fibra',
            'velocidad_bajada' => 100,
            'velocidad_subida' => 20,
            'precio_mensual' => 599.00,
            'moneda' => 'MXN',
            'caracteristicas' => "Primera línea\nSegunda línea",
            'folio_tarifa' => 'CRT-2026-001',
            'destacado' => '1',
            'activo' => '1',
            'orden' => 1,
        ], $sobrescribir);
    }

    public function test_un_visitante_no_entra_al_panel_de_paquetes(): void
    {
        $this->get(route('admin.planes.index'))->assertRedirect(route('login'));
        $this->post(route('admin.planes.store'), $this->datosValidos())
            ->assertRedirect(route('login'));
    }

    public function test_el_administrador_crea_un_paquete(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.planes.store'), $this->datosValidos())
            ->assertRedirect(route('admin.planes.index'));

        $plan = Plan::firstWhere('nombre', 'Plan Hogar 100');

        $this->assertNotNull($plan);
        $this->assertSame(599.0, (float) $plan->precio_mensual);
        $this->assertSame('CRT-2026-001', $plan->folio_tarifa);
        $this->assertTrue($plan->destacado);
        // El textarea llega como texto y se guarda como lista.
        $this->assertSame(['Primera línea', 'Segunda línea'], $plan->caracteristicas);
    }

    /**
     * Los paquetes ya no llevan restricciones: aunque alguien mande el campo a
     * mano, no debe guardarse (ver docs/REQUISITOS-LEGALES.md, requisito 12).
     */
    public function test_las_restricciones_ya_no_se_guardan(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.planes.store'), $this->datosValidos([
                'restricciones' => 'Sujeto a cobertura.',
            ]))
            ->assertRedirect(route('admin.planes.index'));

        $plan = Plan::firstWhere('nombre', 'Plan Hogar 100');

        $this->assertNotNull($plan);
        $this->assertNull($plan->restricciones);
    }

    public function test_el_administrador_edita_el_precio(): void
    {
        $plan = Plan::create($this->datosValidos([
            'caracteristicas' => ['Una'],
            'destacado' => false,
            'activo' => true,
        ]));

        $this->actingAs($this->admin())
            ->put(route('admin.planes.update', $plan), $this->datosValidos([
                'precio_mensual' => 749.50,
            ]))
            ->assertRedirect(route('admin.planes.index'));

        $this->assertSame(749.50, (float) $plan->fresh()->precio_mensual);
    }

    public function test_el_administrador_elimina_un_paquete(): void
    {
        $plan = Plan::create($this->datosValidos([
            'caracteristicas' => ['Una'],
            'destacado' => false,
            'activo' => true,
        ]));

        $this->actingAs($this->admin())
            ->delete(route('admin.planes.destroy', $plan))
            ->assertRedirect(route('admin.planes.index'));

        $this->assertDatabaseMissing('planes', ['id' => $plan->id]);
    }

    public function test_no_se_guarda_un_paquete_invalido(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.planes.store'), $this->datosValidos([
                'nombre' => '',
                'precio_mensual' => 'gratis',
                'velocidad_bajada' => 0,
            ]))
            ->assertSessionHasErrors(['nombre', 'precio_mensual', 'velocidad_bajada']);

        $this->assertSame(0, Plan::count());
    }

    /**
     * La velocidad de subida es opcional: el material comercial de VM MAX
     * solo publica la de descarga, y no se inventa el dato que falta.
     */
    public function test_se_puede_guardar_un_paquete_sin_velocidad_de_subida(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.planes.store'), $this->datosValidos([
                'velocidad_subida' => '',
            ]))
            ->assertRedirect(route('admin.planes.index'))
            ->assertSessionHasNoErrors();

        $this->assertNull(Plan::firstWhere('nombre', 'Plan Hogar 100')->velocidad_subida);
    }

    /** Si la casilla no se envía, el paquete queda oculto (no activo por omisión). */
    public function test_una_casilla_ausente_se_interpreta_como_falso(): void
    {
        $datos = $this->datosValidos();
        unset($datos['activo'], $datos['destacado']);

        $this->actingAs($this->admin())
            ->post(route('admin.planes.store'), $datos)
            ->assertRedirect(route('admin.planes.index'));

        $plan = Plan::firstWhere('nombre', 'Plan Hogar 100');

        $this->assertFalse($plan->activo);
        $this->assertFalse($plan->destacado);
    }
}
