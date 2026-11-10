import { Link } from '@inertiajs/react';
import { ArrowRight, FileText, Info, ShieldCheck } from 'lucide-react';
import { Dato, DatoBloque, ListaDatos } from '@/components/publico/dato';
import PlanCard from '@/components/publico/plan-card';
import Seo from '@/components/publico/seo';
import { Button } from '@/components/ui/button';
import type { PlanPublico } from '@/types/sitio';

export default function Home({
    titulo,
    subtitulo,
    descripcionEmpresa,
    serviciosOfrecidos,
    planes,
    notaPlanes,
}: {
    titulo: string | null;
    subtitulo: string | null;
    descripcionEmpresa: string | null;
    serviciosOfrecidos: string[];
    planes: PlanPublico[];
    notaPlanes: string | null;
}) {
    return (
        <>
            <Seo />

            {/* Los textos del hero los captura el administrador: no se redacta
                publicidad por cuenta propia (puede considerarse engañosa). */}
            <section className="relative overflow-hidden border-b">
                {/* Halos suaves de marca, puramente decorativos. */}
                <div
                    aria-hidden="true"
                    className="bg-primary/10 pointer-events-none absolute -top-32 -right-24 size-96 rounded-full blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-[var(--vm-magenta)]/10 blur-3xl"
                />

                <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
                    <h1
                        className="vm-entra max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                        style={{ '--vm-retraso': '0ms' } as React.CSSProperties}
                    >
                        <Dato
                            valor={titulo}
                            vacio="Título pendiente de captura"
                        />
                    </h1>

                    <div
                        className="text-muted-foreground vm-entra mt-5 max-w-2xl text-lg"
                        style={
                            { '--vm-retraso': '90ms' } as React.CSSProperties
                        }
                    >
                        <DatoBloque
                            valor={subtitulo}
                            vacio="Texto de apoyo pendiente de captura"
                        />
                    </div>

                    <div
                        className="vm-entra mt-9 flex flex-wrap gap-3"
                        style={
                            { '--vm-retraso': '180ms' } as React.CSSProperties
                        }
                    >
                        <Button asChild size="lg" className="rounded-full px-6">
                            <Link href="/contratacion">
                                Cómo contratar
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full px-6"
                        >
                            <Link href="/paquetes">Ver paquetes y tarifas</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {planes.length > 0 && (
                <section className="mx-auto max-w-6xl px-4 py-16">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Nuestros paquetes
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Consulta el detalle completo y los folios de
                                tarifa en la página de paquetes.
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full"
                        >
                            <Link href="/paquetes">
                                Ver todos
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {planes.map((plan, indice) => (
                            /* Aquí conviven paquetes de fibra y de antena, y los
                               nombres comerciales se repiten entre ambas redes,
                               así que cada ficha declara su tecnología. */
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                indice={indice}
                                mostrarTecnologia
                            />
                        ))}
                    </div>

                    {notaPlanes && (
                        <div className="bg-accent/50 mt-8 flex gap-3 rounded-2xl border p-5">
                            <Info
                                className="text-accent-foreground/70 mt-0.5 size-5 shrink-0"
                                aria-hidden="true"
                            />
                            <div className="text-sm">
                                <DatoBloque valor={notaPlanes} />
                            </div>
                        </div>
                    )}
                </section>
            )}

            <section className="bg-muted/50 border-y">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            La empresa
                        </h2>
                        <div className="text-muted-foreground mt-4">
                            <DatoBloque
                                valor={descripcionEmpresa}
                                vacio="Descripción de la empresa pendiente de captura"
                            />
                        </div>
                    </div>

                    <div>
                        {/* Requisito 10: catálogo de trámites / servicios */}
                        <h2 className="text-2xl font-bold tracking-tight">
                            Servicios de telecomunicaciones que ofrecemos
                        </h2>
                        <div className="mt-4">
                            <ListaDatos valores={serviciosOfrecidos} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="text-2xl font-bold tracking-tight">
                    Información legal
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Ponemos a disposición del público la documentación y las
                    ligas oficiales que exige la normativa de
                    telecomunicaciones.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/legal"
                        className="vm-elevar bg-card hover:border-primary/50 flex items-start gap-4 rounded-2xl border p-6"
                    >
                        <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                            <FileText className="size-5" aria-hidden="true" />
                        </span>
                        <span>
                            <span className="block font-semibold">
                                Documentos legales
                            </span>
                            <span className="text-muted-foreground text-sm">
                                Permiso de la CRT, código de prácticas
                                comerciales, carta de derechos y demás
                                documentos descargables en PDF.
                            </span>
                        </span>
                    </Link>

                    <Link
                        href="/transparencia"
                        className="vm-elevar bg-card hover:border-primary/50 flex items-start gap-4 rounded-2xl border p-6"
                    >
                        <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                            <ShieldCheck
                                className="size-5"
                                aria-hidden="true"
                            />
                        </span>
                        <span>
                            <span className="block font-semibold">
                                Transparencia
                            </span>
                            <span className="text-muted-foreground text-sm">
                                Visor de tarifas de la CRT, lineamientos
                                publicados en el DOF y folios de las tarifas
                                registradas.
                            </span>
                        </span>
                    </Link>
                </div>
            </section>
        </>
    );
}
