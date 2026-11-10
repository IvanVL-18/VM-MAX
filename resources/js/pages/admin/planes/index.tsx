import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { formatoPrecio } from '@/components/publico/plan-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PropsCompartidas } from '@/types/sitio';

type PlanFila = {
    id: number;
    nombre: string;
    tecnologia: string;
    tecnologia_etiqueta: string;
    velocidad_bajada: number;
    velocidad_subida: number | null;
    precio_mensual: number;
    moneda: string;
    incluye_tv: boolean;
    incluye_camara: boolean;
    folio_tarifa: string | null;
    destacado: boolean;
    activo: boolean;
    orden: number;
};

export default function PlanesIndex({ planes }: { planes: PlanFila[] }) {
    const { flash } = usePage<PropsCompartidas>().props;

    useEffect(() => {
        if (flash?.exito) {
            toast.success(flash.exito);
        }
    }, [flash?.exito]);

    const eliminar = (plan: PlanFila) => {
        if (
            !window.confirm(
                `¿Eliminar el paquete «${plan.nombre}»? Esta acción no se puede deshacer.`,
            )
        ) {
            return;
        }

        router.delete(`/admin/planes/${plan.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Paquetes" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Paquetes y precios
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Lo que edites aquí se refleja de inmediato en el
                            sitio público.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/admin/planes/create">
                            <Plus className="size-4" aria-hidden="true" />
                            Nuevo paquete
                        </Link>
                    </Button>
                </div>

                {planes.length === 0 ? (
                    <p className="text-muted-foreground">
                        Todavía no hay paquetes registrados.
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Orden
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Nombre
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Tecnología
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Velocidades
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Incluye
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Precio
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Folio CRT
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left font-semibold"
                                    >
                                        Estado
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-right font-semibold"
                                    >
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {planes.map((plan) => (
                                    <tr key={plan.id} className="border-t">
                                        <td className="text-muted-foreground px-4 py-3">
                                            {plan.orden}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {plan.nombre}
                                            {plan.destacado && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    Destacado
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                            {plan.tecnologia_etiqueta}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                            {plan.velocidad_bajada}
                                            {plan.velocidad_subida !== null
                                                ? ` / ${plan.velocidad_subida}`
                                                : ''}{' '}
                                            Mbps
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                            {[
                                                plan.incluye_tv && 'TV',
                                                plan.incluye_camara && 'Cámara',
                                            ]
                                                .filter(Boolean)
                                                .join(' · ') || '—'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {formatoPrecio(
                                                plan.precio_mensual,
                                                plan.moneda,
                                            )}
                                        </td>
                                        <td className="text-muted-foreground max-w-40 truncate px-4 py-3">
                                            {plan.folio_tarifa ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    plan.activo
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {plan.activo
                                                    ? 'Activo'
                                                    : 'Oculto'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/planes/${plan.id}/edit`}
                                                    >
                                                        <Pencil
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="sr-only sm:not-sr-only">
                                                            Editar
                                                        </span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        eliminar(plan)
                                                    }
                                                >
                                                    <Trash2
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="sr-only">
                                                        Eliminar
                                                    </span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

PlanesIndex.layout = {
    breadcrumbs: [
        { title: 'Panel', href: '/admin' },
        { title: 'Paquetes', href: '/admin/planes' },
    ],
};
