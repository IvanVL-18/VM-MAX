<?php

namespace App\Http\Controllers\Publico;

use App\Enums\TipoDocumento;
use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Models\DocumentoLegal;
use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Paginas de contenido semiestatico cuyos textos edita el administrador.
 */
class PaginasController extends Controller
{
    /** Requisito 18: procedimiento de contratacion, requisitos, lugar y horarios. */
    public function contratacion(): Response
    {
        $configuracion = Configuracion::actual();

        return Inertia::render('publico/contratacion', [
            'procedimiento' => $configuracion->contratacion_procedimiento,
            'requisitos' => $configuracion->contratacion_requisitos ?? [],
            'lugar' => $configuracion->contratacion_lugar,
            'horario' => $configuracion->contratacion_horario,
        ]);
    }

    /** Requisito 20: canales de atencion y tiempos de resolucion de quejas. */
    public function quejas(): Response
    {
        $configuracion = Configuracion::actual();

        return Inertia::render('publico/quejas', [
            'procedimiento' => $configuracion->quejas_procedimiento,
            'domicilio' => $configuracion->quejas_domicilio,
            'telefono' => $configuracion->quejas_telefono,
            'correo' => $configuracion->quejas_correo,
            'horario' => $configuracion->quejas_horario,
            'tiempoPromedio' => $configuracion->quejas_tiempo_promedio,
            'tiempoMaximo' => $configuracion->quejas_tiempo_maximo,
        ]);
    }

    /** Requisito 11: medios de pago disponibles. */
    public function mediosDePago(): Response
    {
        $configuracion = Configuracion::actual();

        return Inertia::render('publico/medios-de-pago', [
            'medios' => $configuracion->medios_pago ?? [],
            'nota' => $configuracion->medios_pago_nota,
        ]);
    }

    /**
     * Requisitos 14, 15 y 16: ligas oficiales mostradas de forma individual y
     * visible, mas los folios de tarifas inscritas en la CRT (requisito 13).
     */
    public function transparencia(): Response
    {
        $folios = Plan::query()
            ->activos()
            ->ordenados()
            ->whereNotNull('folio_tarifa')
            ->get(['id', 'nombre', 'folio_tarifa'])
            ->map(fn (Plan $plan) => [
                'id' => $plan->id,
                'nombre' => $plan->nombre,
                'folio_tarifa' => $plan->folio_tarifa,
            ])
            ->all();

        return Inertia::render('publico/transparencia', [
            'enlaces' => config('isp.enlaces_oficiales'),
            'folios' => $folios,
        ]);
    }

    /** Requisito 6: aviso de privacidad como pagina y como PDF descargable. */
    public function avisoDePrivacidad(): Response
    {
        $documento = DocumentoLegal::query()
            ->where('tipo', TipoDocumento::AvisoPrivacidad->value)
            ->first();

        return Inertia::render('publico/aviso-de-privacidad', [
            'documento' => $documento ? [
                'titulo' => $documento->titulo,
                'descripcion' => $documento->descripcion,
                'disponible' => $documento->estaDisponible(),
                'tipo' => $documento->tipo->value,
            ] : null,
        ]);
    }
}
