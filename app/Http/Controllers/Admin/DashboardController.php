<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Models\DocumentoLegal;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $documentos = DocumentoLegal::query()->get();
        $configuracion = Configuracion::actual();

        return Inertia::render('admin/dashboard', [
            'resumen' => [
                'planes_totales' => Plan::query()->count(),
                'planes_activos' => Plan::query()->activos()->count(),
                'documentos_totales' => $documentos->count(),
                'documentos_cargados' => $documentos->filter->estaDisponible()->count(),
            ],
            // Lista de lo que sigue pendiente, para que el administrador vea de
            // un vistazo que requisitos legales todavia no estan cubiertos.
            'pendientes' => $this->pendientes($documentos, $configuracion),
        ]);
    }

    /**
     * @param  Collection<int, DocumentoLegal>  $documentos
     * @return array<int, array{tipo: string, detalle: string}>
     */
    private function pendientes($documentos, Configuracion $configuracion): array
    {
        $pendientes = [];

        foreach ($documentos as $documento) {
            if (! $documento->estaDisponible()) {
                $pendientes[] = [
                    'tipo' => 'Documento',
                    'detalle' => "Falta cargar el PDF: {$documento->titulo} (requisito {$documento->tipo->requisito()})",
                ];
            }
        }

        foreach (Plan::query()->activos()->ordenados()->get() as $plan) {
            if (blank($plan->folio_tarifa) || str_contains((string) $plan->folio_tarifa, 'POR DEFINIR')) {
                $pendientes[] = [
                    'tipo' => 'Paquete',
                    'detalle' => "Falta el folio de tarifa de la CRT en «{$plan->nombre}» (requisito 13)",
                ];
            }
        }

        $enlacePublicacion = collect(config('isp.enlaces_oficiales'))->firstWhere('requisito', 16);

        if (blank($enlacePublicacion['url'] ?? null)) {
            $pendientes[] = [
                'tipo' => 'Enlace oficial',
                'detalle' => 'Falta la URL de los lineamientos generales de publicación (requisito 16). Se define en ISP_URL_LINEAMIENTOS_PUBLICACION.',
            ];
        }

        // Cualquier campo de configuracion que siga con el texto sembrado.
        $camposPendientes = collect($configuracion->getAttributes())
            ->filter(fn ($valor) => is_string($valor) && str_contains($valor, 'POR DEFINIR'))
            ->count();

        if ($camposPendientes > 0) {
            $pendientes[] = [
                'tipo' => 'Configuración',
                'detalle' => "Hay {$camposPendientes} campo(s) de configuración con texto de ejemplo sin reemplazar.",
            ];
        }

        return $pendientes;
    }
}
