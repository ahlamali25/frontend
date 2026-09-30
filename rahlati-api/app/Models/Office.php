<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'address',
        'rating',
        'description',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function owner()
    {
        return $this->hasOne(User::class, 'office_id')->where('role', 'office_admin');
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function buses()
    {
        return $this->hasMany(Bus::class);
    }

    public function drivers()
    {
        return $this->hasMany(Driver::class);
    }
}
