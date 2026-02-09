<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reward extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'points_required',
        'reward_type', // discount, free_month, upgrade, gift
        'value',
        'available',
        'image'
    ];

    protected $casts = [
        'points_required' => 'integer',
        'available' => 'boolean',
    ];

    public function claimedRewards()
    {
        return $this->hasMany(ClaimedReward::class);
    }
}
