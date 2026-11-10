import { Antenna, Cable, ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';
import { DatoBloque } from '@/components/publico/dato';
import PageHeader from '@/components/publico/page-header';
import PlanCard from '@/components/publico/plan-card';
import Seo from '@/components/publico/seo';
import { cn } from '@/lib/utils';
import type { GrupoPaquetes } from '@/types/sitio';

/**
 * Requisitos 12 y 13: precios y tarifas de cada paquete, con características,
 * y el folio de la tarifa inscrita ante la CRT.
 *
 * El catálogo se separa por red porque los nombres comerciales se repiten entre
 * fibra y antena («Básico» a $250 existe en las dos, con velocidades distintas).
 * Cada pestaña lleva además la nota de instalación que le corresponde: la fibra
 * no cobra instalación y la antena sí, así que una nota única sería inexacta.
 */
export default function Paquetes({
    grupos,
    nota,
    enlaceVisorTarifas,
}: {
    grupos: GrupoPaquetes[];
    nota: string | null;
    enlaceVisorTarifas: string | null;
}) {
    const [activa, setActiva] = useState(grupos[0]?.tecnologia ?? 'fibra');

    // Con una sola red capturada las pestañas sobran: se muestra la lista sola.
    const conPestanas = grupos.length > 1;

    const mover = (direccion: -1 | 1) => {
        const actual = grupos.findIndex((grupo) => grupo.tecnologia === activa);
        const siguiente = (actual + direccion + grupos.length) % grupos.length;

        setActiva(grupos[siguiente].tecnologia);
    };

    return (
        <>
            <Seo />

            <PageHeader
                titulo="Paquetes y tarifas"
                descripcion="Detalle de cada paquete: precio mensual, velocidad contratada, características y el folio de la tarifa inscrita ante la CRT."
            />

            <div className="mx-auto max-w-6xl px-4 py-12">
                {grupos.length === 0 ? (
                    <p className="text-muted-foreground">
                        Todavía no hay paquetes publicados.
                    </p>
                ) : (
                    <>
                        {conPestanas && (
                            <div
                                role="tablist"
                                aria-label="Tecnología del servicio"
                                className="bg-muted/60 inline-flex flex-wrap gap-1 rounded-full border p-1"
                                onKeyDown={(evento) => {
                                    if (evento.key === 'ArrowRight') {
                                        evento.preventDefault();
                                        mover(1);
                                    }

                                    if (evento.key === 'ArrowLeft') {
                                        evento.preventDefault();
                                        mover(-1);
                                    }
                                }}
                            >
                                {grupos.map((grupo) => {
                                    const seleccionada =
                                        grupo.tecnologia === activa;
                                    const Icono =
                                        grupo.tecnologia === 'fibra'
                                            ? Cable
                                            : Antenna;

                                    return (
                                        <button
                                            key={grupo.tecnologia}
                                            type="button"
                                            role="tab"
                                            id={`pestana-${grupo.tecnologia}`}
                                            aria-selected={seleccionada}
                                            aria-controls={`panel-${grupo.tecnologia}`}
                                            tabIndex={seleccionada ? 0 : -1}
                                            onClick={() =>
                                                setActiva(grupo.tecnologia)
                                            }
                                            className={cn(
                                                'focus-visible:ring-ring flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                                seleccionada
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            <Icono
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            {grupo.etiqueta}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {grupos.map((grupo) => (
                            <section
                                key={grupo.tecnologia}
                                id={`panel-${grupo.tecnologia}`}
                                role={conPestanas ? 'tabpanel' : undefined}
                                aria-labelledby={
                                    conPestanas
                                        ? `pestana-${grupo.tecnologia}`
                                        : undefined
                                }
                                hidden={
                                    conPestanas && grupo.tecnologia !== activa
                                }
                                className="mt-8"
                            >
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {grupo.titulo}
                                </h2>

                                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {grupo.planes.map((plan, indice) => (
                                        <PlanCard
                                            key={plan.id}
                                            plan={plan}
                                            indice={indice}
                                            detallado
                                        />
                                    ))}
                                </div>

                                {/* Condiciones propias de esta red: costo de
                                    instalación, equipo en préstamo, etc. */}
                                {grupo.nota && (
                                    <div className="bg-accent/50 mt-8 flex gap-3 rounded-2xl border p-5">
                                        <Info
                                            className="text-accent-foreground/70 mt-0.5 size-5 shrink-0"
                                            aria-hidden="true"
                                        />
                                        <div className="text-sm">
                                            <DatoBloque valor={grupo.nota} />
                                        </div>
                                    </div>
                                )}
                            </section>
                        ))}
                    </>
                )}

                {/* Nota general, aplicable a todo el catálogo. */}
                {nota && (
                    <div className="bg-accent/50 mt-8 flex gap-3 rounded-2xl border p-5">
                        <Info
                            className="text-accent-foreground/70 mt-0.5 size-5 shrink-0"
                            aria-hidden="true"
                        />
                        <div className="text-sm">
                            <DatoBloque valor={nota} />
                        </div>
                    </div>
                )}

                {enlaceVisorTarifas && (
                    <div className="bg-muted/50 mt-6 rounded-2xl border p-6">
                        <h2 className="font-semibold">
                            Consulta pública de tarifas
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Las tarifas registradas pueden consultarse
                            directamente en el visor del Instituto Federal de
                            Telecomunicaciones.
                        </p>
                        <a
                            href={enlaceVisorTarifas}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
                        >
                            Abrir el visor de tarifas de la CRT
                            <ExternalLink
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
