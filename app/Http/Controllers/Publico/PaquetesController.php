<?php

namespace App\Http\Controllers\Publico;

use App\Enums\Tecnologia;
use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Models\Plan;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Requisitos 12 y 13: informacion de precios y tarifas de cada paquete, con sus
 * caracteristicas y el folio de la tarifa inscrita en la CRT.
 *
 * El catalogo se agrupa por tecnologia porque los nombres comerciales se
 * repiten entre las dos redes: hay un "Básico" de fibra y otro de antena, ambos
 * a $250 pero con velocidades y condiciones de instalacion distintas. Sin la
 * separacion, la pagina mostraria paquetes aparentemente iguales.
 */
class PaquetesController extends Controller
{
    public function __invoke(): Response
    {
        $configuracion = Configuracion::actual();

        /** @var Collection<int, Plan> $planes */
        $planes = Plan::query()->activos()->ordenados()->get();

        $grupos = collect(Tecnologia::cases())
            ->map(fn (Tecnologia $tecnologia) => [
                'tecnologia' => $tecnologia->value,
                'etiqueta' => $tecnologia->etiqueta(),
                'titulo' => $tecnologia->titulo(),
                'nota' => $this->nota($configuracion, $tecnologia),
                'planes' => $planes
                    ->filter(fn (Plan $plan) => $plan->tecnologia === $tecnologia)
                    ->map->paraSitio()
                    ->values()
                    ->all(),
            ])
            // Una tecnologia sin paquetes capturados no genera pestaña vacia.
            ->filter(fn (array $grupo) => $grupo['planes'] !== [])
            ->values()
            ->all();

        return Inertia::render('publico/paquetes', [
            'grupos' => $grupos,
            'nota' => $configuracion->planes_nota,
            'enlaceVisorTarifas' => collect(config('isp.enlaces_oficiales'))
                ->firstWhere('requisito', 14)['url'] ?? null,
        ]);
    }

    /** Nota de condiciones propia de cada red (instalacion, equipo, etc.). */
    private function nota(Configuracion $configuracion, Tecnologia $tecnologia): ?string
    {
        return match ($tecnologia) {
            Tecnologia::Fibra => $configuracion->planes_nota_fibra,
            Tecnologia::Antena => $configuracion->planes_nota_antena,
        };
    }
}
