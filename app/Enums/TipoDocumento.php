<?php

namespace App\Enums;

/**
 * Tipos de documento legal que la normativa de telecomunicaciones exige
 * publicar. El numero de requisito corresponde al checklist entregado por
 * el despacho juridico (ver docs/REQUISITOS-LEGALES.md).
 */
enum TipoDocumento: string
{
    case PermisoIft = 'permiso_ift';
    case FormatoInfoSimplificada = 'formato_info_simplificada';
    case OficioProfeco = 'oficio_profeco';
    case ConstanciaProfecoIft = 'constancia_profeco_ift';
    case CodigoPracticas = 'codigo_practicas';
    case AvisoPrivacidad = 'aviso_privacidad';
    case CartaDerechos = 'carta_derechos';
    case CodigoEtica = 'codigo_etica';

    public function titulo(): string
    {
        return match ($this) {
            self::PermisoIft => 'Permiso de la CRT (título de concesión)',
            self::FormatoInfoSimplificada => 'Formato de Información Simplificada',
            self::OficioProfeco => 'Oficio de Registro de contrato de adhesión (PROFECO)',
            self::ConstanciaProfecoIft => 'Constancia de inscripción del oficio ante la CRT',
            self::CodigoPracticas => 'Código de Prácticas Comerciales',
            self::AvisoPrivacidad => 'Aviso de Privacidad',
            self::CartaDerechos => 'Carta de Derechos Mínimos del Usuario',
            self::CodigoEtica => 'Código de Ética',
        };
    }

    /** Numero de requisito en el checklist del despacho juridico. */
    public function requisito(): int
    {
        return match ($this) {
            self::PermisoIft => 1,
            self::FormatoInfoSimplificada => 2,
            self::OficioProfeco => 3,
            self::ConstanciaProfecoIft => 4,
            self::CodigoPracticas => 5,
            self::AvisoPrivacidad => 6,
            self::CartaDerechos => 7,
            self::CodigoEtica => 8,
        };
    }

    /** @return array<int, array{value: string, label: string, requisito: int}> */
    public static function paraSelect(): array
    {
        return array_map(fn (self $tipo) => [
            'value' => $tipo->value,
            'label' => $tipo->titulo(),
            'requisito' => $tipo->requisito(),
        ], self::cases());
    }
}
