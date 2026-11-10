<?php

namespace Tests\Feature\Publico;

use App\Enums\TipoDocumento;
use App\Models\DocumentoLegal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DescargaDocumentoTest extends TestCase
{
    use RefreshDatabase;

    /** El PDF se entrega tal cual, forzando la descarga. */
    public function test_un_documento_cargado_se_descarga(): void
    {
        Storage::fake('local');

        $ruta = UploadedFile::fake()
            ->create('permiso.pdf', 12, 'application/pdf')
            ->store('documentos-legales', 'local');

        DocumentoLegal::create([
            'tipo' => TipoDocumento::PermisoIft->value,
            'titulo' => 'Permiso de la CRT',
            'archivo_path' => $ruta,
            'archivo_nombre_original' => 'permiso.pdf',
            'archivo_bytes' => 12288,
            'activo' => true,
        ]);

        $respuesta = $this->get(route('documentos.descargar', ['tipo' => 'permiso_ift']));

        $respuesta->assertOk();
        $respuesta->assertHeader('content-type', 'application/pdf');
        $this->assertStringContainsString(
            'attachment',
            $respuesta->headers->get('content-disposition') ?? ''
        );
        $this->assertStringContainsString(
            'permiso.pdf',
            $respuesta->headers->get('content-disposition') ?? ''
        );
    }

    /** Sin archivo cargado la descarga responde 404, no un archivo vacío. */
    public function test_un_documento_sin_archivo_no_se_descarga(): void
    {
        Storage::fake('local');

        DocumentoLegal::create([
            'tipo' => TipoDocumento::CodigoEtica->value,
            'titulo' => 'Código de Ética',
            'archivo_path' => null,
            'activo' => true,
        ]);

        $this->get(route('documentos.descargar', ['tipo' => 'codigo_etica']))
            ->assertNotFound();
    }

    /** Un documento marcado como oculto no puede descargarse. */
    public function test_un_documento_inactivo_no_se_descarga(): void
    {
        Storage::fake('local');

        $ruta = UploadedFile::fake()
            ->create('etica.pdf', 5, 'application/pdf')
            ->store('documentos-legales', 'local');

        DocumentoLegal::create([
            'tipo' => TipoDocumento::CodigoEtica->value,
            'titulo' => 'Código de Ética',
            'archivo_path' => $ruta,
            'activo' => false,
        ]);

        $this->get(route('documentos.descargar', ['tipo' => 'codigo_etica']))
            ->assertNotFound();
    }

    /** Un tipo que no existe en el enum no debe resolver a ninguna ruta. */
    public function test_un_tipo_desconocido_responde_404(): void
    {
        $this->get('/documentos/tipo-inventado/descargar')->assertNotFound();
    }
}
