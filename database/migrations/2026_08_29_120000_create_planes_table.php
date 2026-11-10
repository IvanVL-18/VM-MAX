<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->unsignedInteger('velocidad_bajada')->comment('Mbps');
            $table->unsignedInteger('velocidad_subida')->comment('Mbps');
            $table->decimal('precio_mensual', 10, 2);
            $table->string('moneda', 3)->default('MXN');
            $table->json('caracteristicas')->nullable();
            $table->text('restricciones')->nullable()->comment('Requisito 12: posibles restricciones del servicio');
            $table->string('folio_tarifa')->nullable()->comment('Requisito 13: folio del registro de tarifas ante la CRT');
            $table->boolean('destacado')->default(false);
            $table->boolean('activo')->default(true);
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();

            $table->index(['activo', 'orden']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planes');
    }
};
