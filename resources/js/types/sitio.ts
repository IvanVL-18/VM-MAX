/** Datos de contacto e identidad compartidos en todas las páginas. */
export type DatosSitio = {
    marca_comercial: string | null;
    razon_social: string | null;
    domicilio_atencion: string | null;
    horario_oficina: string | null;
    telefono_atencion: string | null;
    correo_atencion: string | null;
    correo_facturacion: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    whatsapp: string | null;
    servicios_ofrecidos: string[];
};

/** Red con la que se entrega el servicio. */
export type Tecnologia = 'fibra' | 'antena';

/** Un paquete de Internet tal como se muestra en el sitio público. */
export type PlanPublico = {
    id: number;
    nombre: string;
    tecnologia: Tecnologia;
    tecnologia_etiqueta: string;
    velocidad_bajada: number;
    /** Null cuando la empresa aún no ha publicado la velocidad de subida. */
    velocidad_subida: number | null;
    precio_mensual: number;
    moneda: string;
    caracteristicas: string[];
    incluye_tv: boolean;
    incluye_camara: boolean;
    folio_tarifa: string | null;
    destacado: boolean;
};

/**
 * Paquetes de una misma red, con la nota de condiciones que le corresponde.
 *
 * Los nombres comerciales se repiten entre fibra y antena, así que el catálogo
 * viaja agrupado: es lo que permite mostrarlos separados sin confundirlos.
 */
export type GrupoPaquetes = {
    tecnologia: Tecnologia;
    etiqueta: string;
    titulo: string;
    nota: string | null;
    planes: PlanPublico[];
};

/** Liga a un sitio oficial (CRT / DOF) que la normativa obliga a publicar. */
export type EnlaceOficial = {
    requisito: number;
    titulo: string;
    descripcion: string;
    url: string | null;
};

/** Metadatos de SEO que el servidor calcula para la página actual. */
export type DatosSeo = {
    titulo: string | null;
    descripcion: string | null;
    canonica: string;
    indexable: boolean;
};

/** Props que Inertia comparte en todas las páginas. */
export type PropsCompartidas = {
    name: string;
    appUrl: string;
    sitio: DatosSitio;
    seo: DatosSeo;
    flash: { exito: string | null };
};
