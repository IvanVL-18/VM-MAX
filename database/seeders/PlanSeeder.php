<?php

namespace Database\Seeders;

use App\Enums\Tecnologia;
use App\Models\Plan;
use Illuminate\Database\Seeder;

/**
 * Paquetes reales de VM MAX, tomados de su material comercial.
 *
 * La empresa opera dos redes y publica un catalogo por cada una. Los nombres
 * comerciales se repiten entre ambas ("Básico" existe en fibra a 40 Mbps y en
 * antena a 10 Mbps, las dos a $250), asi que la tecnologia forma parte de la
 * clave con la que se busca el paquete: sin ella, un catalogo sobrescribiria
 * al otro.
 *
 * El material solo publica la velocidad de descarga ("HASTA 40MB"), por eso
 * `velocidad_subida` queda en null. La fibra se anuncia como simetrica, pero
 * eso se registra como caracteristica —tal como lo dice el material— y no como
 * un dato tecnico inventado; en cuanto la empresa defina la cifra, se captura
 * desde el panel.
 *
 * Las caracteristicas son las que la propia empresa difunde. Las que son
 * promesas contractuales ("sin plazos forzosos", "sin aumentar el costo mes con
 * mes") deben coincidir con el contrato de adhesion registrado ante PROFECO
 * antes de publicarse: aqui se dejan tal como vienen en el material, pero el
 * cliente debe validarlas.
 */
class PlanSeeder extends Seeder
{
    /** Condiciones que el material comercial anuncia para toda la red de fibra. */
    private const COMUNES_FIBRA = [
        'Internet simétrico',
        'Conexión estable',
        'Sin plazos forzosos',
        'Sin aumento de costo mes con mes',
        'Sin costo de instalación',
    ];

    /** Condiciones que el material comercial anuncia para la red por antena. */
    private const COMUNES_ANTENA = [
        'Instalación por antena',
        'Equipo en préstamo durante la vigencia del servicio',
    ];

    private const TV = 'Aplicación de TV incluida, disponible en Smart TV, tablet o celular (hasta 3 dispositivos)';

    private const CAMARA = 'Cámara de seguridad incluida';

    public function run(): void
    {
        $catalogo = [
            // Fibra óptica
            ['tecnologia' => Tecnologia::Fibra, 'nombre' => 'Básico', 'bajada' => 40, 'precio' => 250.00, 'tv' => false, 'camara' => false, 'destacado' => false, 'orden' => 1],
            ['tecnologia' => Tecnologia::Fibra, 'nombre' => 'Estándar', 'bajada' => 80, 'precio' => 300.00, 'tv' => true, 'camara' => false, 'destacado' => false, 'orden' => 2],
            ['tecnologia' => Tecnologia::Fibra, 'nombre' => 'Premium', 'bajada' => 150, 'precio' => 350.00, 'tv' => true, 'camara' => false, 'destacado' => true, 'orden' => 3],
            ['tecnologia' => Tecnologia::Fibra, 'nombre' => 'Gold', 'bajada' => 200, 'precio' => 400.00, 'tv' => true, 'camara' => true, 'destacado' => false, 'orden' => 4],
            ['tecnologia' => Tecnologia::Fibra, 'nombre' => 'Platino', 'bajada' => 300, 'precio' => 500.00, 'tv' => true, 'camara' => true, 'destacado' => false, 'orden' => 5],
            ['tecnologia' => Tecnologia::Fibra, 'nombre' => 'Diamante', 'bajada' => 600, 'precio' => 600.00, 'tv' => true, 'camara' => true, 'destacado' => false, 'orden' => 6],

            // Antena
            ['tecnologia' => Tecnologia::Antena, 'nombre' => 'Básico', 'bajada' => 10, 'precio' => 250.00, 'tv' => false, 'camara' => false, 'destacado' => false, 'orden' => 1],
            ['tecnologia' => Tecnologia::Antena, 'nombre' => 'Estándar', 'bajada' => 15, 'precio' => 300.00, 'tv' => false, 'camara' => false, 'destacado' => false, 'orden' => 2],
            ['tecnologia' => Tecnologia::Antena, 'nombre' => 'Premium', 'bajada' => 20, 'precio' => 350.00, 'tv' => false, 'camara' => false, 'destacado' => true, 'orden' => 3],
            ['tecnologia' => Tecnologia::Antena, 'nombre' => 'Platino', 'bajada' => 30, 'precio' => 400.00, 'tv' => false, 'camara' => false, 'destacado' => false, 'orden' => 4],
        ];

        foreach ($catalogo as $paquete) {
            Plan::query()->updateOrCreate(
                [
                    'nombre' => $paquete['nombre'],
                    'tecnologia' => $paquete['tecnologia']->value,
                ],
                [
                    'velocidad_bajada' => $paquete['bajada'],
                    'velocidad_subida' => null,
                    'precio_mensual' => $paquete['precio'],
                    'moneda' => 'MXN',
                    'caracteristicas' => $this->caracteristicas($paquete),
                    'incluye_tv' => $paquete['tv'],
                    'incluye_camara' => $paquete['camara'],
                    'folio_tarifa' => '[POR DEFINIR: folio CRT]',
                    'destacado' => $paquete['destacado'],
                    'activo' => true,
                    'orden' => $paquete['orden'],
                ]
            );
        }

        // Los paquetes de ejemplo del arranque inicial ya no aplican.
        Plan::query()
            ->whereIn('nombre', ['Plan Hogar 50', 'Plan Hogar 100', 'Plan Hogar 200'])
            ->delete();
    }

    /**
     * @param  array{tecnologia: Tecnologia, bajada: int, tv: bool, camara: bool}  $paquete
     * @return array<int, string>
     */
    private function caracteristicas(array $paquete): array
    {
        $caracteristicas = ['Velocidad de descarga de hasta '.$paquete['bajada'].' Mbps'];

        $caracteristicas = array_merge($caracteristicas, match ($paquete['tecnologia']) {
            Tecnologia::Fibra => self::COMUNES_FIBRA,
            Tecnologia::Antena => self::COMUNES_ANTENA,
        });

        if ($paquete['tv']) {
            $caracteristicas[] = self::TV;
        }

        if ($paquete['camara']) {
            $caracteristicas[] = self::CAMARA;
        }

        return $caracteristicas;
    }
}
