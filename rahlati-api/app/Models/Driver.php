<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'office_id',
        'name',
        'phone',
        'national_id',
        'license_number',
        'assigned_bus_id',
        'notes',
        'status',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function assignedBus()
    {
        return $this->belongsTo(Bus::class, 'assigned_bus_id');
    }

    public function tripsAsDriver()
    {
        return $this->hasMany(Trip::class, 'driver_id');
    }

    public function tripsAsAssistant()
    {
        return $this->hasMany(Trip::class, 'assistant_driver_id');
    }
}
