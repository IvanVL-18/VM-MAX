import { ExternalLink } from 'lucide-react';
import { Dato } from '@/components/publico/dato';
import PageHeader from '@/components/publico/page-header';
import Seo from '@/components/publico/seo';
import type { EnlaceOficial } from '@/types/sitio';

type FolioPlan = {
    id: number;
    nombre: string;
    folio_tarifa: string | null;
};

/**
 * Requisitos 14, 15 y 16: las ligas oficiales deben aparecer de forma
 * individual y visible en el sitio, no solamente dentro del PDF del Código de
 * Prácticas Comerciales. Requisito 13: folios de tarifas inscritas en la CRT.
 */
export default function Transparencia({
    enlaces,
    folios,
}: {
    enlaces: EnlaceOficial[];
    folios: FolioPlan[];
}) {
    return (
        <>
            <Seo />

            <PageHeader
                titulo="Transparencia"
                descripcion="Ligas a la información oficial publicada por la Comisión Reguladora de Telecomunicaciones y en el Diario Oficial de la Federación, junto con los folios de nuestras tarifas registradas."
            />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <section>
                    <h2 className="text-xl font-semibold">Enlaces oficiales</h2>

                    <ul className="mt-4 space-y-4">
                        {enlaces.map((enlace) => (
                            <li
                                key={enlace.requisito}
                                className="bg-card rounded-xl border p-5"
                            >
                                <h3 className="font-semibold">
                                    {enlace.titulo}
                                </h3>
                                <p className="text-muted-foreground mt-1.5 text-sm">
                                    {enlace.descripcion}
                                </p>

                                {enlace.url ? (
                                    <a
                                        href={enlace.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-medium break-all underline underline-offset-4"
                                    >
                                        {enlace.url}
                                        <ExternalLink
                                            className="size-3.5 shrink-0"
                                            aria-hidden="true"
                                        />
                                    </a>
                                ) : (
                                    /* Se muestra explícitamente en lugar de
                                       ocultarlo: así queda claro que el
                                       requisito sigue sin cubrirse. */
                                    <p className="mt-3 inline-block rounded border border-dashed border-amber-500/60 bg-amber-50 px-2 py-1 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                                        Enlace pendiente de confirmar.
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-semibold">
                        Folios de tarifas registradas
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Folio con el que cada tarifa quedó inscrita en el
                        Registro Público de Telecomunicaciones.
                    </p>

                    {folios.length === 0 ? (
                        <p className="text-muted-foreground mt-4 italic">
                            No hay folios capturados todavía.
                        </p>
                    ) : (
                        <div className="mt-4 overflow-x-auto rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left font-semibold"
                                        >
                                            Paquete
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left font-semibold"
                                        >
                                            Folio de tarifa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folios.map((folio) => (
                                        <tr key={folio.id} className="border-t">
                                            <td className="px-4 py-3">
                                                {folio.nombre}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Dato
                                                    valor={folio.folio_tarifa}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
