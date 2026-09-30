<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = [
        'office_id',
        'bus_id',
        'driver_id',
        'assistant_driver_id',
        'from_governorate',
        'to_governorate',
        'departure_date',
        'departure_time',
        'arrival_time',
        'is_recurring',
        'recurring_days',
        'seat_price',
        'vip_seat_price',
        'booking_closes_minutes_before',
        'available_seats',
        'status',
    ];

    protected $casts = [
        'recurring_days' => 'array',
        'is_recurring' => 'boolean',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function bus()
    {
        return $this->belongsTo(Bus::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function assistantDriver()
    {
        return $this->belongsTo(Driver::class, 'assistant_driver_id');
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
