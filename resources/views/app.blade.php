<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light">

        {{-- Fondo inicial claro, el mismo que define app.css. --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                color-scheme: light;
            }
        </style>

        <meta name="theme-color" content="#5b3be0">

        {{--
            Los navegadores guardan el favicon con mucha más insistencia que
            el resto de los archivos: sin algo que distinga la URL, siguen
            pintando el icono anterior aunque en disco ya haya otro. La fecha
            de modificación hace de versión y se actualiza sola cada vez que
            se reemplaza el archivo.
        --}}
        @php($versionIcono = filemtime(public_path('favicon.ico')) ?: 1)
        <link rel="icon" href="/favicon.ico?v={{ $versionIcono }}" sizes="48x48 32x32 16x16">
        <link rel="icon" href="/favicon-96.png?v={{ $versionIcono }}" type="image/png" sizes="96x96">
        <link rel="icon" href="/favicon-32.png?v={{ $versionIcono }}" type="image/png" sizes="32x32">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v={{ $versionIcono }}">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        {{--
            SEO renderizado en el servidor.

            El slot de <x-inertia::head> solo se usa cuando NO corre el proceso
            de SSR de Inertia; si algún día se activa, el head del SSR gana y
            este bloque deja de emitirse. Se genera aquí para que un rastreador
            que no ejecute JavaScript reciba título, descripción y Open Graph ya
            en la respuesta HTML.
        --}}
        <x-inertia::head>
            @php($seo = $page['props']['seo'] ?? [])
            @php($nombreApp = config('app.name', 'Laravel'))

            <title>{{ ($seo['titulo'] ?? null) ? $seo['titulo'].' - '.$nombreApp : $nombreApp }}</title>

            @if (! empty($seo['descripcion']))
                <meta name="description" content="{{ $seo['descripcion'] }}">
            @endif

            @if (! empty($seo['canonica']))
                <link rel="canonical" href="{{ $seo['canonica'] }}">
            @endif

            {{-- El panel de administración no debe aparecer en buscadores. --}}
            @if (empty($seo['indexable']))
                <meta name="robots" content="noindex, nofollow">
            @endif

            <meta property="og:type" content="website">
            <meta property="og:locale" content="es_MX">
            <meta property="og:site_name" content="{{ $nombreApp }}">
            <meta property="og:title" content="{{ $seo['titulo'] ?? $nombreApp }}">
            @if (! empty($seo['descripcion']))
                <meta property="og:description" content="{{ $seo['descripcion'] }}">
                <meta name="twitter:description" content="{{ $seo['descripcion'] }}">
            @endif
            @if (! empty($seo['canonica']))
                <meta property="og:url" content="{{ $seo['canonica'] }}">
            @endif
            <meta name="twitter:card" content="summary">
            <meta name="twitter:title" content="{{ $seo['titulo'] ?? $nombreApp }}">
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
