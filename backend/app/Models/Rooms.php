<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rooms extends Model
{
    //
    protected $table = 'rooms';
    public $timestamps = false;

    protected $fillable = [
        'nomor_kamar',
        'ukuran_kamar',
        'listrik',
        'harga',
        'kos_id',
        'users_id'
    ];

    public function kos()
    {
        return $this->belongsTo(Kos::class, 'kos_id', 'id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'users_id', 'id');
    }
}
