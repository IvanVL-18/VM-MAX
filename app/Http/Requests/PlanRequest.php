<?php

namespace App\Http\Requests;

use App\Enums\Tecnologia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlanRequest extends FormRequest
{
    /** El grupo de rutas ya exige sesion iniciada (middleware `auth`). */
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'tecnologia' => ['required', Rule::enum(Tecnologia::class)],
            'velocidad_bajada' => ['required', 'integer', 'min:1', 'max:100000'],
            'velocidad_subida' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'precio_mensual' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'moneda' => ['required', 'string', 'size:3'],
            'caracteristicas' => ['nullable', 'array'],
            'caracteristicas.*' => ['string', 'max:255'],
            'incluye_tv' => ['boolean'],
            'incluye_camara' => ['boolean'],
            'folio_tarifa' => ['nullable', 'string', 'max:255'],
            'destacado' => ['boolean'],
            'activo' => ['boolean'],
            'orden' => ['required', 'integer', 'min:0', 'max:65535'],
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'nombre' => 'nombre del paquete',
            'tecnologia' => 'tecnología',
            'velocidad_bajada' => 'velocidad de bajada',
            'velocidad_subida' => 'velocidad de subida',
            'precio_mensual' => 'precio mensual',
            'moneda' => 'moneda',
            'caracteristicas' => 'características',
            'incluye_tv' => 'servicio de televisión',
            'incluye_camara' => 'cámara de seguridad',
            'folio_tarifa' => 'folio de tarifa',
            'orden' => 'orden de despliegue',
        ];
    }

    /**
     * El formulario manda las caracteristicas como texto (una por linea) y las
     * casillas como "0"/"1"; aqui se normalizan antes de validar.
     */
    protected function prepareForValidation(): void
    {
        $caracteristicas = $this->input('caracteristicas');

        if (is_string($caracteristicas)) {
            $caracteristicas = collect(preg_split('/\r\n|\r|\n/', $caracteristicas))
                ->map(fn (string $linea) => trim($linea))
                ->filter()
                ->values()
                ->all();
        }

        $this->merge([
            'caracteristicas' => $caracteristicas ?? [],
            'incluye_tv' => $this->boolean('incluye_tv'),
            'incluye_camara' => $this->boolean('incluye_camara'),
            'destacado' => $this->boolean('destacado'),
            'activo' => $this->boolean('activo'),
            'moneda' => strtoupper((string) $this->input('moneda', 'MXN')),
        ]);
    }
}
