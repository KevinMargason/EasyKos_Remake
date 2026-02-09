<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'amount',
        'payment_type', // rent, utilities, deposit, other
        'payment_method', // cash, bank_transfer, e-wallet
        'payment_date',
        'due_date',
        'status', // pending, paid, overdue, cancelled
        'notes',
        'receipt_image'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'due_date' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
