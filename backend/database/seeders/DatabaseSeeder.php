<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $ownerId = DB::table('users')->insertGetId([
            'nama'       => 'Haji Lulung',
            'no_hp'      => '081200000000',
            'pin'        => Hash::make('123456'), 
            'email'      => 'owner@kos.com',
            'role'       => 'owner',
            'created_at' => now(),
        ]);

        for ($i = 1; $i <= 5; $i++) {
            $roomId = DB::table('rooms')->insertGetId([
                'user_id'     => $ownerId,
                'nomor_kamar' => 'Kamar-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'harga'       => 1000000 + ($i * 100000), 
            ]);

            if ($i < 5) {
                $tenantId = DB::table('tenants')->insertGetId([
                    'room_id' => $roomId,
                    'nama'    => 'Penyewa Ke-' . $i,
                    'no_hp'   => '0857000000' . $i,
                    'aktif'   => 1,
                    'created_at' => now(),
                ]);

                $bulanDaftar = ['2024-01', '2024-02'];
                
                foreach ($bulanDaftar as $index => $bln) {
                    DB::table('payments')->insert([
                        'tenant_id'     => $tenantId,
                        'bulan'         => $bln,
                        'status'        => ($index == 0) ? 'PAID' : 'UNPAID',
                        'tanggal_bayar' => ($index == 0) ? now() : null,
                        'created_at'    => now(),
                    ]);
                }
            }
        }
    }
}