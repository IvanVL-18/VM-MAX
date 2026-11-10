import type { ImgHTMLAttributes } from 'react';

/*
| Marca VM-MAX
|
| El arte lo entrega el cliente y vive en `public/`; aquí solo se envuelve
| para no repetir rutas ni medidas por toda la aplicación. Los tres archivos
| salen del original con fondo recortado:
|
|   - `logo-vm-max.png`      logotipo completo (ondas + rótulo)
|   - `vm-max-ondas.png`     solo las ondas, a color
|   - `vm-max-ondas-blanco.png`  las ondas en una tinta, para fondos oscuros
|
| `width` y `height` llevan las medidas reales del archivo: el navegador
| reserva el espacio antes de descargar la imagen y la página no da el salto
| al cargar. El tamaño visible lo fija `className` (`h-12 w-auto`, etc.).
*/

type PropsImagen = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt' | 'width' | 'height'
>;

/**
 * Ondas de señal, sin el rótulo. Para espacios donde «VM-MAX» no se leería:
 * la barra del panel, el encabezado compacto.
 *
 * Con `blanco` se usa la versión de una tinta, pensada para cuando las ondas
 * van encima de un fondo de marca y el degradado original se perdería.
 */
export function IsotipoVmMax({
    blanco = false,
    ...props
}: PropsImagen & { blanco?: boolean }) {
    return (
        <img
            src={blanco ? '/vm-max-ondas-blanco.png' : '/vm-max-ondas.png'}
            alt=""
            width={229}
            height={124}
            {...props}
        />
    );
}

/**
 * Logotipo completo.
 *
 * `titulo` es el texto alternativo. En el encabezado el enlace ya dice a
 * dónde lleva, así que ahí se pasa vacío y la imagen queda decorativa.
 */
export default function LogoVmMax({
    titulo = 'VM-MAX',
    ...props
}: PropsImagen & { titulo?: string }) {
    return (
        <img
            src="/logo-vm-max.png"
            alt={titulo}
            width={426}
            height={201}
            {...props}
        />
    );
}
