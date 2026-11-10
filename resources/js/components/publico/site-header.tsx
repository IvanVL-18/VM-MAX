import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LogoVmMax from '@/components/logo-vm-max';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PropsCompartidas } from '@/types/sitio';

const NAVEGACION = [
    { titulo: 'Inicio', href: '/' },
    { titulo: 'Paquetes', href: '/paquetes' },
    { titulo: 'Contratación', href: '/contratacion' },
    { titulo: 'Medios de pago', href: '/medios-de-pago' },
    { titulo: 'Quejas', href: '/quejas' },
    { titulo: 'Transparencia', href: '/transparencia' },
    { titulo: 'Legal', href: '/legal' },
];

export default function SiteHeader() {
    const pagina = usePage<PropsCompartidas>();
    const { sitio } = pagina.props;
    const [abierto, setAbierto] = useState(false);

    const activo = (href: string) =>
        href === '/' ? pagina.url === '/' : pagina.url.startsWith(href);

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 vm-filo-degradado sticky top-0 z-40 border-b backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <Link
                    href="/"
                    className="flex min-w-0 shrink-0 items-center"
                    aria-label="Ir al inicio"
                >
                    {/*
                        El logotipo ya contiene el nombre de la marca, así que
                        no se repite como texto; la marca comercial capturada
                        queda para lectores de pantalla y buscadores.
                    */}
                    <LogoVmMax className="h-12 w-auto sm:h-14" titulo="" />
                    <span className="sr-only">
                        {sitio?.marca_comercial ?? 'Inicio'}
                    </span>
                </Link>

                <nav
                    className="hidden items-center gap-1 lg:flex"
                    aria-label="Navegación principal"
                >
                    {NAVEGACION.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'rounded-md px-3 py-2 text-sm transition-colors',
                                activo(item.href)
                                    ? 'bg-accent text-accent-foreground font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                            )}
                            aria-current={
                                activo(item.href) ? 'page' : undefined
                            }
                        >
                            {item.titulo}
                        </Link>
                    ))}
                </nav>

                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setAbierto((estado) => !estado)}
                    aria-expanded={abierto}
                    aria-controls="menu-movil"
                    aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
                >
                    {abierto ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </Button>
            </div>

            {abierto && (
                <nav
                    id="menu-movil"
                    className="border-t lg:hidden"
                    aria-label="Navegación principal"
                >
                    <div className="mx-auto max-w-6xl px-4 py-2">
                        {NAVEGACION.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setAbierto(false)}
                                className={cn(
                                    'block rounded-md px-3 py-2.5 text-sm',
                                    activo(item.href)
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                                aria-current={
                                    activo(item.href) ? 'page' : undefined
                                }
                            >
                                {item.titulo}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}
