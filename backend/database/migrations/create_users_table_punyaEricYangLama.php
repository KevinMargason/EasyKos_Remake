<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->nullable();
            $table->string('no_hp', 20)->unique();
            $table->string('pin', 255); 
            $table->string('email')->nullable();
            $table->enum('role', ['owner', 'tenant', 'admin'])->default('owner');
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->string('nomor_kamar', 10);
            $table->integer('harga');
            $table->unique(['user_id', 'nomor_kamar'], 'uniq_user_room');
        });

        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->onDelete('restrict')->onUpdate('cascade');
            $table->string('nama', 100);
            $table->string('no_hp', 20)->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->onUpdate('cascade');
            $table->char('bulan', 7);
            $table->enum('status', ['PAID', 'UNPAID'])->default('UNPAID');
            $table->date('tanggal_bayar')->nullable();
            $table->unique(['tenant_id', 'bulan'], 'uniq_tenant_bulan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
