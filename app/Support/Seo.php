<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Metadatos de SEO por página.
 *
 * Viven en el servidor a proposito. Inertia solo puede rendir el <head> en el
 * servidor cuando corre el proceso de SSR en Node; sin el, las etiquetas que
 * pone React se inyectan despues de cargar la pagina y un rastreador que no
 * ejecute JavaScript no las ve. Generandolas aqui, cada URL responde con su
 * titulo, su descripcion y sus etiquetas Open Graph ya en el HTML inicial.
 */
class Seo
{
    /**
     * Titulo y descripcion de cada ruta publica.
     *
     * @var array<string, array{titulo: string, descripcion: string}>
     */
    private const PAGINAS = [
        'home' => [
            'titulo' => 'Inicio',
            'descripcion' => 'Paquetes de Internet, información de contratación, medios de pago y documentación legal del servicio.',
        ],
        'paquetes' => [
            'titulo' => 'Paquetes y tarifas',
            'descripcion' => 'Paquetes de Internet por fibra óptica y por antena: precios, velocidades, características y folios de tarifa registrados ante la CRT.',
        ],
        'contratacion' => [
            'titulo' => 'Contratación del servicio',
            'descripcion' => 'Procedimiento para contratar el servicio de Internet, requisitos, lugar y horarios de atención.',
        ],
        'quejas' => [
            'titulo' => 'Quejas y atención a usuarios',
            'descripcion' => 'Canales para presentar una queja: domicilio, teléfono, medios electrónicos, horario de atención y tiempos de resolución.',
        ],
        'medios-de-pago' => [
            'titulo' => 'Medios de pago',
            'descripcion' => 'Formas de pago disponibles para cubrir el servicio de Internet contratado.',
        ],
        'transparencia' => [
            'titulo' => 'Transparencia',
            'descripcion' => 'Enlaces oficiales de la CRT y del Diario Oficial de la Federación, y folios de las tarifas registradas.',
        ],
        'aviso-de-privacidad' => [
            'titulo' => 'Aviso de privacidad',
            'descripcion' => 'Aviso de privacidad sobre el tratamiento de los datos personales de nuestros usuarios, disponible para consulta y descarga en PDF.',
        ],
        'legal' => [
            'titulo' => 'Documentos legales',
            'descripcion' => 'Descarga en PDF el permiso de la CRT, el código de prácticas comerciales, la carta de derechos mínimos del usuario y demás documentación obligatoria.',
        ],
    ];

    /**
     * Metadatos de la ruta actual.
     *
     * El panel y las pantallas de sesion devuelven `indexable => false` para
     * que no los recojan los buscadores.
     *
     * @return array{titulo: string|null, descripcion: string|null, canonica: string, indexable: bool}
     */
    public static function paraPeticion(Request $request): array
    {
        $nombreRuta = $request->route()?->getName();
        $pagina = self::PAGINAS[$nombreRuta] ?? null;

        return [
            'titulo' => $pagina['titulo'] ?? null,
            'descripcion' => $pagina['descripcion'] ?? null,
            'canonica' => $request->url(),
            'indexable' => $pagina !== null,
        ];
    }
}
