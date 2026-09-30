<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('office_id')->constrained('offices')->cascadeOnDelete();
            $table->foreignId('bus_id')->constrained('buses')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained('drivers')->cascadeOnDelete();
            $table->foreignId('assistant_driver_id')->constrained('drivers')->cascadeOnDelete();
            $table->string('from_governorate');
            $table->string('to_governorate');
            $table->date('departure_date');
            $table->time('departure_time');
            $table->time('arrival_time');
            $table->boolean('is_recurring')->default(false);
            $table->json('recurring_days')->nullable();
            $table->decimal('seat_price', 10, 2);
            $table->decimal('vip_seat_price', 10, 2)->nullable();
            $table->unsignedInteger('booking_closes_minutes_before')->default(30);
            $table->unsignedInteger('available_seats');
            $table->string('status')->default('published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
