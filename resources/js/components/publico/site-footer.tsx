import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Clock,
} from 'lucide-react';
import LogoVmMax from '@/components/logo-vm-max';
import { Dato, ListaDatos } from '@/components/publico/dato';
import { enlaceWhatsapp } from '@/lib/whatsapp';
import type { PropsCompartidas } from '@/types/sitio';

/**
 * Pie de página global.
 *
 * Concentra los datos que la normativa obliga a mostrar en todo el sitio:
 * domicilio de atención, horario de oficina, correos de atención y de
 * facturación, teléfono, marca comercial, redes sociales y el catálogo de
 * servicios de telecomunicaciones ofrecidos (requisito 10).
 */
export default function SiteFooter() {
    const { sitio } = usePage<PropsCompartidas>().props;
    const anio = new Date().getFullYear();

    const redes = [
        { url: sitio?.facebook_url, icono: Facebook, etiqueta: 'Facebook' },
        { url: sitio?.instagram_url, icono: Instagram, etiqueta: 'Instagram' },
        {
            url: enlaceWhatsapp(sitio?.whatsapp),
            icono: MessageCircle,
            etiqueta: 'WhatsApp',
        },
    ].filter((red) => Boolean(red.url));

    return (
        <footer className="bg-muted/40 mt-16 border-t">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <section>
                        <LogoVmMax className="mb-4 h-12 w-auto" />

                        <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                            Marca comercial
                        </h2>
                        <p className="text-sm">
                            <Dato valor={sitio?.marca_comercial} />
                        </p>
                        {sitio?.razon_social && (
                            <p className="text-muted-foreground mt-1 text-sm">
                                <Dato valor={sitio.razon_social} />
                            </p>
                        )}
                    </section>

                    <section>
                        <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                            Atención a clientes
                        </h2>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex gap-2">
                                <MapPin
                                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    <span className="sr-only">Domicilio: </span>
                                    <Dato valor={sitio?.domicilio_atencion} />
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <Clock
                                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    <span className="sr-only">
                                        Horario de oficina:{' '}
                                    </span>
                                    <Dato valor={sitio?.horario_oficina} />
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <Phone
                                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    <span className="sr-only">Teléfono: </span>
                                    <Dato valor={sitio?.telefono_atencion} />
                                </span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                            Correos
                        </h2>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex gap-2">
                                <Mail
                                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    <span className="text-muted-foreground block text-xs">
                                        Atención a clientes
                                    </span>
                                    <Dato valor={sitio?.correo_atencion} />
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <Mail
                                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    <span className="text-muted-foreground block text-xs">
                                        Facturación
                                    </span>
                                    <Dato valor={sitio?.correo_facturacion} />
                                </span>
                            </li>
                        </ul>

                        {redes.length > 0 && (
                            <div className="mt-4 flex gap-3">
                                {redes.map((red) => (
                                    <a
                                        key={red.etiqueta}
                                        href={red.url as string}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={red.etiqueta}
                                    >
                                        <red.icono className="size-5" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        {/* Requisito 10: catálogo de servicios ofrecidos */}
                        <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                            Servicios que ofrecemos
                        </h2>
                        <div className="text-sm">
                            <ListaDatos valores={sitio?.servicios_ofrecidos} />
                        </div>
                    </section>
                </div>

                <div className="mt-10 border-t pt-6">
                    <nav
                        className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-sm"
                        aria-label="Enlaces legales"
                    >
                        <Link
                            href="/legal"
                            className="hover:text-foreground transition-colors"
                        >
                            Documentos legales
                        </Link>
                        <Link
                            href="/aviso-de-privacidad"
                            className="hover:text-foreground transition-colors"
                        >
                            Aviso de privacidad
                        </Link>
                        <Link
                            href="/transparencia"
                            className="hover:text-foreground transition-colors"
                        >
                            Transparencia
                        </Link>
                        <Link
                            href="/quejas"
                            className="hover:text-foreground transition-colors"
                        >
                            Quejas y atención
                        </Link>
                    </nav>

                    <p className="text-muted-foreground mt-4 text-xs">
                        © {anio}{' '}
                        <Dato valor={sitio?.marca_comercial} vacio="—" />. Todos
                        los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
