<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'room_type',
        'floor',
        'capacity',
        'price',
        'facilities',
        'status', // available, occupied, maintenance
        'description',
        'images'
    ];

    protected $casts = [
        'facilities' => 'array',
        'images' => 'array',
        'price' => 'decimal:2'
    ];

    public function tenants()
    {
        return $this->hasMany(Tenant::class);
    }
}
