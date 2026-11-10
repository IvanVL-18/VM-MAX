import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type PlanEditable = {
    id: number;
    nombre: string;
    tecnologia: string;
    velocidad_bajada: number;
    velocidad_subida: number | null;
    precio_mensual: number;
    moneda: string;
    caracteristicas: string[];
    incluye_tv: boolean;
    incluye_camara: boolean;
    folio_tarifa: string | null;
    destacado: boolean;
    activo: boolean;
    orden: number;
};

type TecnologiaOpcion = { value: string; label: string };

export default function PlanForm({
    plan,
    tecnologias,
    siguienteOrden,
}: {
    plan: PlanEditable | null;
    tecnologias: TecnologiaOpcion[];
    siguienteOrden: number;
}) {
    const editando = plan !== null;

    return (
        <>
            <Head
                title={editando ? `Editar ${plan.nombre}` : 'Nuevo paquete'}
            />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        {editando ? `Editar «${plan.nombre}»` : 'Nuevo paquete'}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        El folio de tarifa es obligatorio por normativa; procura
                        no dejarlo vacío.
                    </p>
                </div>

                <Form
                    action={
                        editando ? `/admin/planes/${plan.id}` : '/admin/planes'
                    }
                    method={editando ? 'put' : 'post'}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">
                                    Nombre del paquete
                                </Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    required
                                    defaultValue={plan?.nombre ?? ''}
                                    placeholder="Plan Hogar 50"
                                />
                                <InputError message={errors.nombre} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tecnologia">Tecnología</Label>
                                <select
                                    id="tecnologia"
                                    name="tecnologia"
                                    required
                                    defaultValue={plan?.tecnologia ?? ''}
                                    className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                                >
                                    <option value="" disabled>
                                        Selecciona una tecnología
                                    </option>
                                    {tecnologias.map((tecnologia) => (
                                        <option
                                            key={tecnologia.value}
                                            value={tecnologia.value}
                                        >
                                            {tecnologia.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-muted-foreground text-xs">
                                    Los nombres comerciales se repiten entre las
                                    dos redes, así que esto es lo que separa un
                                    paquete de otro en el sitio.
                                </p>
                                <InputError message={errors.tecnologia} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="velocidad_bajada">
                                        Velocidad de bajada (Mbps)
                                    </Label>
                                    <Input
                                        id="velocidad_bajada"
                                        name="velocidad_bajada"
                                        type="number"
                                        min={1}
                                        required
                                        defaultValue={
                                            plan?.velocidad_bajada ?? ''
                                        }
                                    />
                                    <InputError
                                        message={errors.velocidad_bajada}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="velocidad_subida">
                                        Velocidad de subida (Mbps)
                                    </Label>
                                    <Input
                                        id="velocidad_subida"
                                        name="velocidad_subida"
                                        type="number"
                                        min={1}
                                        defaultValue={
                                            plan?.velocidad_subida ?? ''
                                        }
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        Opcional. Si lo dejas vacío, el sitio no
                                        la publica.
                                    </p>
                                    <InputError
                                        message={errors.velocidad_subida}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="precio_mensual">
                                        Precio mensual
                                    </Label>
                                    <Input
                                        id="precio_mensual"
                                        name="precio_mensual"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        required
                                        defaultValue={
                                            plan?.precio_mensual ?? ''
                                        }
                                    />
                                    <InputError
                                        message={errors.precio_mensual}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="moneda">Moneda</Label>
                                    <Input
                                        id="moneda"
                                        name="moneda"
                                        maxLength={3}
                                        required
                                        defaultValue={plan?.moneda ?? 'MXN'}
                                    />
                                    <InputError message={errors.moneda} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="caracteristicas">
                                    Características
                                </Label>
                                <textarea
                                    id="caracteristicas"
                                    name="caracteristicas"
                                    rows={5}
                                    defaultValue={(
                                        plan?.caracteristicas ?? []
                                    ).join('\n')}
                                    className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                                    placeholder={'Una característica por línea'}
                                />
                                <p className="text-muted-foreground text-xs">
                                    Escribe una característica por línea. Evita
                                    frases publicitarias que no puedas
                                    sustentar.
                                </p>
                                <InputError message={errors.caracteristicas} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="folio_tarifa">
                                    Folio de tarifa (CRT)
                                </Label>
                                <Input
                                    id="folio_tarifa"
                                    name="folio_tarifa"
                                    defaultValue={plan?.folio_tarifa ?? ''}
                                />
                                <p className="text-muted-foreground text-xs">
                                    Requisito 13: folio con el que la tarifa
                                    quedó inscrita ante la CRT.
                                </p>
                                <InputError message={errors.folio_tarifa} />
                            </div>

                            <div className="grid gap-2 sm:max-w-40">
                                <Label htmlFor="orden">
                                    Orden de despliegue
                                </Label>
                                <Input
                                    id="orden"
                                    name="orden"
                                    type="number"
                                    min={0}
                                    required
                                    defaultValue={plan?.orden ?? siguienteOrden}
                                />
                                <InputError message={errors.orden} />
                            </div>

                            <div className="space-y-3">
                                {/* Servicios incluidos: el sitio los marca con
                                    un icono en la ficha del paquete. */}
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="incluye_tv"
                                        name="incluye_tv"
                                        value="1"
                                        defaultChecked={
                                            plan?.incluye_tv ?? false
                                        }
                                    />
                                    <Label htmlFor="incluye_tv">
                                        Incluye televisión
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="incluye_camara"
                                        name="incluye_camara"
                                        value="1"
                                        defaultChecked={
                                            plan?.incluye_camara ?? false
                                        }
                                    />
                                    <Label htmlFor="incluye_camara">
                                        Incluye cámara de seguridad
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Si la casilla va desmarcada el campo no
                                        se envía, y el FormRequest lo resuelve
                                        como falso con boolean(). */}
                                    <Checkbox
                                        id="destacado"
                                        name="destacado"
                                        value="1"
                                        defaultChecked={
                                            plan?.destacado ?? false
                                        }
                                    />
                                    <Label htmlFor="destacado">
                                        Destacar en la página de inicio
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="activo"
                                        name="activo"
                                        value="1"
                                        defaultChecked={plan?.activo ?? true}
                                    />
                                    <Label htmlFor="activo">
                                        Visible en el sitio público
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    {editando
                                        ? 'Guardar cambios'
                                        : 'Crear paquete'}
                                </Button>
                                <Button asChild variant="outline" type="button">
                                    <Link href="/admin/planes">Cancelar</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

PlanForm.layout = {
    breadcrumbs: [
        { title: 'Panel', href: '/admin' },
        { title: 'Paquetes', href: '/admin/planes' },
    ],
};
