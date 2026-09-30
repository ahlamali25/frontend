<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    protected $fillable = [
        'office_id',
        'fleet_number',
        'plate_number',
        'name',
        'type',
        'model',
        'year',
        'capacity',
        'seat_layout',
        'contact_phone',
        'driver_id',
        'status',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }
}
