# Mapa de requisitos legales → dónde vive cada uno en el código

Checklist entregado por el despacho jurídico, con la ubicación exacta de su
implementación. Sirve para auditar que no falte nada antes de publicar.

**Leyenda de origen:** _Despacho_ = lo entrega el despacho jurídico ·
_Cliente_ = lo captura el cliente desde el panel · _Fijo_ = constante de
configuración.

| No. | Requisito                                            | Tipo         | Dónde vive                                            | Origen                   |
| --- | ---------------------------------------------------- | ------------ | ----------------------------------------------------- | ------------------------ |
| 1   | Permiso de la CRT (título de concesión)              | PDF          | `/legal` → `permiso_ift`                              | Despacho                 |
| 2   | Formato de Información Simplificada                  | PDF          | `/legal` → `formato_info_simplificada`                | Despacho                 |
| 3   | Oficio de Registro de contrato de adhesión (PROFECO) | PDF          | `/legal` → `oficio_profeco`                           | Despacho                 |
| 4   | Constancia de inscripción del oficio ante la CRT     | PDF          | `/legal` → `constancia_profeco_ift`                   | Despacho                 |
| 5   | Código de Prácticas Comerciales                      | PDF          | `/legal` → `codigo_practicas`                         | Despacho                 |
| 6   | Aviso de Privacidad                                  | PDF + página | `/aviso-de-privacidad` y `/legal`                     | Despacho                 |
| 7   | Carta de Derechos Mínimos del Usuario                | PDF          | `/legal` → `carta_derechos`                           | Despacho                 |
| 8   | Código de Ética                                      | PDF          | `/legal` → `codigo_etica`                             | Despacho                 |
| 10  | Catálogo de trámites (servicios ofrecidos)           | Página       | Pie de página global + `/`                            | Cliente                  |
| 11  | Medios de pago                                       | Página       | `/medios-de-pago`                                     | Cliente                  |
| 12  | Precios, tarifas y características                   | Página       | `/paquetes`                                           | Cliente — ver nota ⚠️    |
| 13  | Folios de tarifas inscritas en la CRT                | Página       | `/paquetes` y `/transparencia` (campo `folio_tarifa`) | Cliente                  |
| 14  | Liga del visor de tarifas                            | Enlace       | `/transparencia`                                      | Fijo                     |
| 15  | Liga de lineamientos de calidad del servicio fijo    | Enlace       | `/transparencia`                                      | Fijo                     |
| 16  | Liga de lineamientos generales de publicación        | Enlace       | `/transparencia`                                      | Fijo — **URL pendiente** |
| 18  | Contratación del servicio                            | Página       | `/contratacion`                                       | Cliente                  |
| 20  | Quejas                                               | Página       | `/quejas`                                             | Cliente                  |

> ⚠️ **Requisito 12 — restricciones no publicadas.** El checklist del despacho
> pide publicar «precios, tarifas, características **y restricciones**». Por
> decisión del cliente los paquetes no publican restricciones: la sección se
> retiró de `/paquetes` y el campo se retiró de `/admin/planes`. La columna
> `restricciones` sigue existiendo en la tabla `planes` (vacía y sin uso), así
> que revertirlo es solo volver a exponerla. Conviene que el despacho jurídico
> esté enterado de esta omisión.

**Datos adicionales obligatorios** (domicilio de atención, horario de oficina,
correo de atención y de facturación, teléfono, marca comercial y servicios
ofrecidos) se muestran en el pie de página de **todas** las páginas. Se comparten
vía Inertia desde `HandleInertiaRequests::datosDelSitio()`.

## Datos ya capturados

Tomados del material comercial que VM MAX ya difunde:

- **Marca comercial:** VM MAX.
- **Paquetes (req. 12):** Básico 10 Mbps $250 · Estándar 15 Mbps $300 · Premium
  20 Mbps $350 · Platino 30 Mbps $400.
- **Nota de los paquetes:** instalación por antena $500, incluye el primer mes;
  el equipo se queda en préstamo.
- **Medios de pago (req. 11):** pago en OXXO con las dos tarjetas BBVA, más la
  indicación de enviar el comprobante.

## Pendientes conocidos

1. **Requisito 16 sin URL.** El checklist del despacho no incluye la liga
   completa del DOF. Se pide al despacho y se captura en la variable de entorno
   `ISP_URL_LINEAMIENTOS_PUBLICACION`. Mientras esté vacía, `/transparencia`
   muestra el enlace como _«pendiente de confirmar»_ en lugar de ocultarlo, para
   que la omisión sea visible.

2. **Numeración con huecos.** El checklist salta del 8 al 10, del 16 al 18 y del
   18 al 20. Los números 9, 17 y 19 no aparecen en el documento fuente. Conviene
   confirmar con el despacho si son requisitos omitidos por error o si esa
   numeración es intencional. La tabla de arriba tiene 17 filas, no 16.

3. **Velocidad de subida sin publicar.** El material comercial solo indica la
   velocidad de descarga ("hasta 10MB"). El campo `velocidad_subida` quedó como
   opcional y la ficha del paquete solo lo muestra si está capturado: publicar
   una velocidad de subida inventada sería una característica técnica no
   sustentada, con el mismo riesgo que un texto publicitario sin respaldo.

4. **Faltan medios de pago.** Solo están capturados los dos pagos en OXXO. La
   lista tiene una entrada `[POR DEFINIR]` para los demás.

5. **Números de tarjeta en una página pública.** Las tarjetas BBVA se publican
   porque así lo hace ya la empresa en su material, pero un sitio web queda
   indexado por buscadores, a diferencia de una publicación en redes. Conviene
   confirmar con el cliente que quiere ese nivel de exposición; si prefiere que
   no se indexe, la alternativa es entregar los números por un canal de contacto.

6. **Textos de marketing.** El sitio no incluye ningún eslogan ni frase
   promocional redactada por el equipo de desarrollo: PROFECO puede considerarlas
   publicidad engañosa. Todos los textos visibles son campos editables y salen
   sembrados como `[POR DEFINIR: ...]`. El sitio los resalta en ámbar hasta que
   el cliente o el despacho los reemplacen.

## Dónde se administra cada cosa

| Panel                  | Qué edita                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `/admin/planes`        | Paquetes: precio, velocidades, características (req. 12) y folio de tarifa (req. 13)               |
| `/admin/documentos`    | Sube y reemplaza los PDF de los requisitos 1 al 8                                                  |
| `/admin/configuracion` | Contacto, servicios (req. 10), medios de pago (req. 11), contratación (req. 18) y quejas (req. 20) |

El panel muestra en su portada la lista de pendientes: documentos sin PDF,
paquetes sin folio y campos de configuración que siguen con texto de ejemplo.

## Cómo se sirven los PDF

Los archivos se guardan en el disco `local` de Laravel
(`storage/app/private/documentos-legales`), que **no** es accesible por URL
directa. Se entregan únicamente por la ruta `/documentos/{tipo}/descargar`, que
verifica que el documento esté activo y que el archivo exista antes de forzar la
descarga con `Content-Type: application/pdf`.

Se publica el archivo original tal como lo entrega el despacho, sin conversión ni
regeneración. La subida valida el tipo real del archivo con la regla
`mimetypes:application/pdf`, no solo la extensión.
