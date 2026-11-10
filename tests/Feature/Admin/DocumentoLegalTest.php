<?php

namespace Tests\Feature\Admin;

use App\Enums\TipoDocumento;
use App\Models\DocumentoLegal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentoLegalTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_un_visitante_no_sube_documentos(): void
    {
        $this->get(route('admin.documentos.index'))->assertRedirect(route('login'));
    }

    public function test_el_administrador_sube_un_pdf(): void
    {
        Storage::fake('local');

        $this->actingAs($this->admin())
            ->post(route('admin.documentos.store'), [
                'tipo' => TipoDocumento::CartaDerechos->value,
                'titulo' => 'Carta de Derechos Mínimos del Usuario',
                'activo' => '1',
                'archivo' => UploadedFile::fake()->create('carta.pdf', 50, 'application/pdf'),
            ])
            ->assertRedirect(route('admin.documentos.index'));

        $documento = DocumentoLegal::firstWhere('tipo', TipoDocumento::CartaDerechos->value);

        $this->assertNotNull($documento);
        $this->assertNotNull($documento->archivo_path);
        $this->assertSame('carta.pdf', $documento->archivo_nombre_original);
        Storage::disk('local')->assertExists($documento->archivo_path);
    }

    /** La validación mira el contenido real, no solo la extensión. */
    public function test_se_rechaza_un_archivo_que_no_es_pdf(): void
    {
        Storage::fake('local');

        $this->actingAs($this->admin())
            ->post(route('admin.documentos.store'), [
                'tipo' => TipoDocumento::CodigoEtica->value,
                'titulo' => 'Código de Ética',
                'activo' => '1',
                // Extensión .pdf pero contenido de texto plano.
                'archivo' => UploadedFile::fake()->create('falso.pdf', 10, 'text/plain'),
            ])
            ->assertSessionHasErrors('archivo');

        $this->assertSame(0, DocumentoLegal::count());
    }

    public function test_se_rechaza_una_imagen(): void
    {
        Storage::fake('local');

        $this->actingAs($this->admin())
            ->post(route('admin.documentos.store'), [
                'tipo' => TipoDocumento::CodigoEtica->value,
                'titulo' => 'Código de Ética',
                'activo' => '1',
                'archivo' => UploadedFile::fake()->image('foto.jpg'),
            ])
            ->assertSessionHasErrors('archivo');
    }

    /** Al reemplazar el PDF, el archivo anterior se borra del disco. */
    public function test_reemplazar_el_pdf_borra_el_anterior(): void
    {
        Storage::fake('local');

        $rutaVieja = UploadedFile::fake()
            ->create('vieja.pdf', 10, 'application/pdf')
            ->store('documentos-legales', 'local');

        $documento = DocumentoLegal::create([
            'tipo' => TipoDocumento::CodigoPracticas->value,
            'titulo' => 'Código de Prácticas Comerciales',
            'archivo_path' => $rutaVieja,
            'archivo_nombre_original' => 'vieja.pdf',
            'activo' => true,
        ]);

        $this->actingAs($this->admin())
            ->put(route('admin.documentos.update', $documento), [
                'tipo' => TipoDocumento::CodigoPracticas->value,
                'titulo' => 'Código de Prácticas Comerciales',
                'activo' => '1',
                'archivo' => UploadedFile::fake()->create('nueva.pdf', 20, 'application/pdf'),
            ])
            ->assertRedirect(route('admin.documentos.index'));

        $documento->refresh();

        $this->assertSame('nueva.pdf', $documento->archivo_nombre_original);
        Storage::disk('local')->assertExists($documento->archivo_path);
        Storage::disk('local')->assertMissing($rutaVieja);
    }

    /** Se puede editar el registro sin volver a subir el archivo. */
    public function test_editar_sin_archivo_conserva_el_pdf(): void
    {
        Storage::fake('local');

        $ruta = UploadedFile::fake()
            ->create('permiso.pdf', 10, 'application/pdf')
            ->store('documentos-legales', 'local');

        $documento = DocumentoLegal::create([
            'tipo' => TipoDocumento::PermisoIft->value,
            'titulo' => 'Permiso de la CRT',
            'archivo_path' => $ruta,
            'archivo_nombre_original' => 'permiso.pdf',
            'activo' => true,
        ]);

        $this->actingAs($this->admin())
            ->put(route('admin.documentos.update', $documento), [
                'tipo' => TipoDocumento::PermisoIft->value,
                'titulo' => 'Permiso de la CRT (actualizado)',
                'activo' => '1',
            ])
            ->assertRedirect(route('admin.documentos.index'));

        $documento->refresh();

        $this->assertSame('Permiso de la CRT (actualizado)', $documento->titulo);
        $this->assertSame($ruta, $documento->archivo_path);
        Storage::disk('local')->assertExists($ruta);
    }

    public function test_eliminar_el_documento_borra_su_archivo(): void
    {
        Storage::fake('local');

        $ruta = UploadedFile::fake()
            ->create('etica.pdf', 10, 'application/pdf')
            ->store('documentos-legales', 'local');

        $documento = DocumentoLegal::create([
            'tipo' => TipoDocumento::CodigoEtica->value,
            'titulo' => 'Código de Ética',
            'archivo_path' => $ruta,
            'activo' => true,
        ]);

        $this->actingAs($this->admin())
            ->delete(route('admin.documentos.destroy', $documento))
            ->assertRedirect(route('admin.documentos.index'));

        $this->assertDatabaseMissing('documentos_legales', ['id' => $documento->id]);
        Storage::disk('local')->assertMissing($ruta);
    }

    /** El tipo es único: no puede haber dos registros del mismo documento. */
    public function test_no_se_duplica_un_tipo_de_documento(): void
    {
        Storage::fake('local');

        DocumentoLegal::create([
            'tipo' => TipoDocumento::AvisoPrivacidad->value,
            'titulo' => 'Aviso de Privacidad',
            'activo' => true,
        ]);

        $this->actingAs($this->admin())
            ->post(route('admin.documentos.store'), [
                'tipo' => TipoDocumento::AvisoPrivacidad->value,
                'titulo' => 'Otro aviso',
                'activo' => '1',
            ])
            ->assertSessionHasErrors('tipo');
    }
}
