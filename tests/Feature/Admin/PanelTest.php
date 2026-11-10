<?php

namespace Tests\Feature\Admin;

use App\Enums\TipoDocumento;
use App\Models\DocumentoLegal;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

/** Verifica que todas las pantallas del panel se rendericen. */
class PanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_las_pantallas_del_panel_cargan(): void
    {
        $plan = Plan::create([
            'nombre' => 'Plan de prueba',
            'velocidad_bajada' => 50,
            'velocidad_subida' => 10,
            'precio_mensual' => 399.00,
            'activo' => true,
            'orden' => 1,
        ]);

        $documento = DocumentoLegal::create([
            'tipo' => TipoDocumento::PermisoIft->value,
            'titulo' => 'Permiso de la CRT',
            'activo' => true,
        ]);

        $pantallas = [
            route('admin.dashboard') => 'admin/dashboard',
            route('admin.planes.index') => 'admin/planes/index',
            route('admin.planes.create') => 'admin/planes/form',
            route('admin.planes.edit', $plan) => 'admin/planes/form',
            route('admin.documentos.index') => 'admin/documentos/index',
            route('admin.documentos.create') => 'admin/documentos/form',
            route('admin.documentos.edit', $documento) => 'admin/documentos/form',
            route('admin.configuracion.edit') => 'admin/configuracion',
        ];

        $admin = User::factory()->create();

        foreach ($pantallas as $url => $componente) {
            $this->actingAs($admin)
                ->get($url)
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page->component($componente));
        }
    }

    /** El dashboard avisa de los documentos que aún no tienen PDF. */
    public function test_el_panel_lista_los_pendientes(): void
    {
        DocumentoLegal::create([
            'tipo' => TipoDocumento::CartaDerechos->value,
            'titulo' => 'Carta de Derechos Mínimos del Usuario',
            'archivo_path' => null,
            'activo' => true,
        ]);

        $respuesta = $this->actingAs(User::factory()->create())
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('resumen.documentos_totales', 1)
                ->where('resumen.documentos_cargados', 0)
            );

        $pendientes = collect($respuesta->viewData('page')['props']['pendientes']);

        $this->assertTrue(
            $pendientes->contains(fn (array $pendiente) => str_contains($pendiente['detalle'], 'Carta de Derechos')),
            'El panel debería avisar que falta el PDF de la carta de derechos.'
        );
    }
}
