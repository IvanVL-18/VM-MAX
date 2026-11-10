import {
    Antenna,
    ArrowDownToLine,
    ArrowUpFromLine,
    Cable,
    Cctv,
    Check,
    Tv,
} from 'lucide-react';
import { Dato } from '@/components/publico/dato';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PlanPublico } from '@/types/sitio';

/** Formatea el precio en pesos mexicanos. */
export function formatoPrecio(monto: number, moneda: string): string {
    try {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: moneda || 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: monto % 1 === 0 ? 0 : 2,
        }).format(monto);
    } catch {
        return `$${monto.toFixed(2)} ${moneda}`;
    }
}

/**
 * Tarjeta de un paquete.
 *
 * Con `detallado` muestra además el folio de
 * la tarifa inscrita en la CRT (requisito 13), que es como debe presentarse en
 * la página de paquetes.
 *
 * `mostrarTecnologia` se usa donde conviven paquetes de las dos redes (la
 * portada): los nombres comerciales se repiten entre fibra y antena, así que
 * sin la etiqueta habría dos «Básico» al mismo precio y con distinta velocidad.
 * Dentro de la página de paquetes va apagado porque la pestaña ya lo dice.
 *
 * `indice` sirve para escalonar la animación de entrada de la lista.
 */
export default function PlanCard({
    plan,
    detallado = false,
    mostrarTecnologia = false,
    indice = 0,
}: {
    plan: PlanPublico;
    detallado?: boolean;
    mostrarTecnologia?: boolean;
    indice?: number;
}) {
    const IconoTecnologia = plan.tecnologia === 'fibra' ? Cable : Antenna;

    // Los servicios incluidos se marcan con icono, igual que en el material
    // comercial de la empresa.
    const incluidos = [
        plan.incluye_tv && { icono: Tv, etiqueta: 'Incluye televisión' },
        plan.incluye_camara && {
            icono: Cctv,
            etiqueta: 'Incluye cámara de seguridad',
        },
    ].filter((incluido) => incluido !== false) as {
        icono: typeof Tv;
        etiqueta: string;
    }[];

    return (
        <article
            className={cn(
                'vm-elevar vm-entra bg-card flex h-full flex-col rounded-2xl border p-6',
                plan.destacado
                    ? 'border-primary/50 shadow-primary/10 shadow-lg'
                    : 'shadow-sm',
            )}
            style={
                { '--vm-retraso': `${indice * 70}ms` } as React.CSSProperties
            }
        >
            <header>
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{plan.nombre}</h3>
                    {plan.destacado && <Badge>Destacado</Badge>}
                </div>

                {mostrarTecnologia && (
                    <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
                        <IconoTecnologia
                            className="size-3.5"
                            aria-hidden="true"
                        />
                        {plan.tecnologia_etiqueta}
                    </p>
                )}

                <p className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-primary text-4xl font-bold tracking-tight">
                        {formatoPrecio(plan.precio_mensual, plan.moneda)}
                    </span>
                    <span className="text-muted-foreground text-sm">/ mes</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                    Precio mensual en {plan.moneda}.
                </p>
            </header>

            <dl
                className={cn(
                    'mt-5 grid gap-3',
                    plan.velocidad_subida ? 'grid-cols-2' : 'grid-cols-1',
                )}
            >
                <div className="bg-accent/60 rounded-xl p-3">
                    <dt className="text-accent-foreground/70 flex items-center gap-1.5 text-xs">
                        <ArrowDownToLine
                            className="size-3.5"
                            aria-hidden="true"
                        />
                        Descarga
                    </dt>
                    <dd className="mt-1 font-semibold">
                        hasta {plan.velocidad_bajada} Mbps
                    </dd>
                </div>

                {/* La velocidad de subida solo aparece si está capturada: no se
                    publica un dato técnico que la empresa no haya definido. */}
                {plan.velocidad_subida !== null && (
                    <div className="bg-accent/60 rounded-xl p-3">
                        <dt className="text-accent-foreground/70 flex items-center gap-1.5 text-xs">
                            <ArrowUpFromLine
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Carga
                        </dt>
                        <dd className="mt-1 font-semibold">
                            hasta {plan.velocidad_subida} Mbps
                        </dd>
                    </div>
                )}
            </dl>

            {incluidos.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                    {incluidos.map((incluido) => (
                        <li key={incluido.etiqueta}>
                            <Badge
                                variant="secondary"
                                className="gap-1.5 font-normal"
                            >
                                <incluido.icono
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                {incluido.etiqueta}
                            </Badge>
                        </li>
                    ))}
                </ul>
            )}

            {plan.caracteristicas.length > 0 && (
                <ul className="mt-5 space-y-2.5 text-sm">
                    {plan.caracteristicas.map((caracteristica, i) => (
                        <li
                            key={`${caracteristica}-${i}`}
                            className="flex gap-2.5"
                        >
                            <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                                <Check className="size-3" aria-hidden="true" />
                            </span>
                            <Dato valor={caracteristica} />
                        </li>
                    ))}
                </ul>
            )}

            {detallado && (
                <div className="mt-auto space-y-3 border-t pt-4 text-sm">
                    {/* Requisito 13: folio de la tarifa inscrita en la CRT */}
                    <div>
                        <h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Folio de tarifa registrada ante la CRT
                        </h4>
                        <div className="mt-1">
                            <Dato
                                valor={plan.folio_tarifa}
                                vacio="Folio pendiente de captura"
                            />
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
