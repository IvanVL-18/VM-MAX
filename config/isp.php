<?php

/*
|--------------------------------------------------------------------------
| Configuracion del sitio del proveedor de Internet
|--------------------------------------------------------------------------
|
| Aqui viven los valores que NO cambian y que por lo tanto no ameritan una
| tabla en la base de datos: las ligas a sitios oficiales (CRT / DOF) que la
| normativa obliga a mostrar de forma individual y visible.
|
| Los datos que si cambian (contacto, horarios, medios de pago, textos de
| contratacion y quejas) viven en la tabla `configuracion` y los edita el
| administrador desde el panel.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Enlaces oficiales obligatorios
    |--------------------------------------------------------------------------
    |
    | Requisitos 14, 15 y 16 del checklist legal. Deben mostrarse de forma
    | individual y visible en el sitio, no unicamente dentro del PDF del
    | Codigo de Practicas Comerciales.
    |
    */

    'enlaces_oficiales' => [

        [
            'requisito' => 14,
            'titulo' => 'Visor de tarifas de la CRT',
            'descripcion' => 'Consulta pública de las tarifas registradas ante la Comisión Reguladora de Telecomunicaciones.',
            'url' => 'https://tarifas.ift.org.mx/ift_visor/',
        ],

        [
            'requisito' => 15,
            'titulo' => 'Lineamientos de calidad del servicio fijo',
            'descripcion' => 'Publicación en el Diario Oficial de la Federación de los lineamientos que fijan los parámetros de calidad del servicio de Internet fijo.',
            'url' => 'https://dof.gob.mx/nota_detalle.php?codigo=55873',
        ],

        [
            'requisito' => 16,
            'titulo' => 'Lineamientos generales de publicación de información',
            'descripcion' => 'Publicación en el Diario Oficial de la Federación de los lineamientos sobre la información que los concesionarios deben poner a disposición del público.',
            // PENDIENTE: el checklist del despacho no incluye la URL completa.
            // Solicitarla y capturarla aqui (o via la variable de entorno).
            // Mientras sea null, la pagina de transparencia lo muestra
            // explicitamente como pendiente en lugar de omitirlo en silencio.
            'url' => env('ISP_URL_LINEAMIENTOS_PUBLICACION'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Disco de almacenamiento de los documentos legales
    |--------------------------------------------------------------------------
    |
    | Se usa el disco `local` (no publico): los PDF se sirven siempre a traves
    | de la ruta de descarga controlada, nunca por URL directa. Asi la
    | aplicacion decide que se entrega y puede forzar la descarga.
    |
    */

    'disco_documentos' => 'local',

    'ruta_documentos' => 'documentos-legales',

    /*
    |--------------------------------------------------------------------------
    | Limite de subida de PDF (kilobytes)
    |--------------------------------------------------------------------------
    */

    'max_kb_documento' => 20480, // 20 MB

];
