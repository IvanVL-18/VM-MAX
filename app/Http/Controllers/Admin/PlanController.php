<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Tecnologia;
use App\Http\Controllers\Controller;
use App\Http\Requests\PlanRequest;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Nucleo del panel: el administrador edita aqui los precios y las tarifas de
 * los paquetes sin tocar codigo.
 */
class PlanController extends Controller
{
    public function index(): Response
    {
        $planes = Plan::query()
            ->orderBy('tecnologia')
            ->ordenados()
            ->get()
            ->map(fn (Plan $plan) => [
                'id' => $plan->id,
                'nombre' => $plan->nombre,
                'tecnologia' => $plan->tecnologia->value,
                'tecnologia_etiqueta' => $plan->tecnologia->etiqueta(),
                'velocidad_bajada' => $plan->velocidad_bajada,
                'velocidad_subida' => $plan->velocidad_subida,
                'precio_mensual' => (float) $plan->precio_mensual,
                'moneda' => $plan->moneda,
                'incluye_tv' => $plan->incluye_tv,
                'incluye_camara' => $plan->incluye_camara,
                'folio_tarifa' => $plan->folio_tarifa,
                'destacado' => $plan->destacado,
                'activo' => $plan->activo,
                'orden' => $plan->orden,
            ])
            ->all();

        return Inertia::render('admin/planes/index', [
            'planes' => $planes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/planes/form', [
            'plan' => null,
            'tecnologias' => Tecnologia::paraSelect(),
            'siguienteOrden' => (int) Plan::query()->max('orden') + 1,
        ]);
    }

    public function store(PlanRequest $request): RedirectResponse
    {
        Plan::query()->create($request->validated());

        return to_route('admin.planes.index')
            ->with('exito', 'Paquete creado correctamente.');
    }

    public function show(Plan $plan): RedirectResponse
    {
        return to_route('admin.planes.edit', $plan);
    }

    public function edit(Plan $plan): Response
    {
        return Inertia::render('admin/planes/form', [
            'plan' => [
                'id' => $plan->id,
                'nombre' => $plan->nombre,
                'tecnologia' => $plan->tecnologia->value,
                'velocidad_bajada' => $plan->velocidad_bajada,
                'velocidad_subida' => $plan->velocidad_subida,
                'precio_mensual' => (float) $plan->precio_mensual,
                'moneda' => $plan->moneda,
                'caracteristicas' => $plan->caracteristicas ?? [],
                'incluye_tv' => $plan->incluye_tv,
                'incluye_camara' => $plan->incluye_camara,
                'folio_tarifa' => $plan->folio_tarifa,
                'destacado' => $plan->destacado,
                'activo' => $plan->activo,
                'orden' => $plan->orden,
            ],
            'tecnologias' => Tecnologia::paraSelect(),
            'siguienteOrden' => $plan->orden,
        ]);
    }

    public function update(PlanRequest $request, Plan $plan): RedirectResponse
    {
        $plan->update($request->validated());

        return to_route('admin.planes.index')
            ->with('exito', 'Paquete actualizado correctamente.');
    }

    public function destroy(Plan $plan): RedirectResponse
    {
        $plan->delete();

        return to_route('admin.planes.index')
            ->with('exito', 'Paquete eliminado.');
    }
}
