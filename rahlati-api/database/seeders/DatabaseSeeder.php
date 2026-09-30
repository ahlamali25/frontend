<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Bus;
use App\Models\Driver;
use App\Models\Office;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $offices = [
            ['name' => 'مكتب دمشق الدولي', 'phone' => '0999999991', 'address' => 'دمشق', 'status' => 'active'],
            ['name' => 'مكتب حلب السريع', 'phone' => '0999999992', 'address' => 'حلب', 'status' => 'active'],
            ['name' => 'مكتب حمص الرحلات', 'phone' => '0999999993', 'address' => 'حمص', 'status' => 'active'],
        ];

        $createdOffices = [];
        foreach ($offices as $officeData) {
            $createdOffices[] = Office::create($officeData);
        }

        foreach ($createdOffices as $index => $office) {
            $officeAdmin = User::create([
                'name' => 'مدير ' . $office->name,
                'email' => 'admin' . ($index + 1) . '@example.com',
                'phone' => '099000000' . ($index + 1),
                'password' => Hash::make('password'),
                'role' => 'office_admin',
                'office_id' => $office->id,
            ]);

            $office->refresh();
        }

        $passenger = User::create([
            'name' => 'مسافر تجريبي',
            'email' => 'passenger@example.com',
            'phone' => '0991111111',
            'password' => Hash::make('password'),
            'role' => 'passenger',
        ]);

        $buses = [];
        foreach ($createdOffices as $officeIndex => $office) {
            for ($i = 1; $i <= 4; $i++) {
                $bus = Bus::create([
                    'office_id' => $office->id,
                    'fleet_number' => 'SH-' . ($officeIndex + 1) . $i,
                    'plate_number' => 'SY-' . (1000 + $officeIndex * 10 + $i),
                    'name' => $i % 2 === 0 ? 'باص VIP' : 'باص سياحي',
                    'type' => $i % 2 === 0 ? 'VIP' : 'سياحي',
                    'model' => 'Mercedes Sprinter',
                    'year' => '2024',
                    'capacity' => 24,
                    'seat_layout' => '2+1',
                    'contact_phone' => '099222222' . ($officeIndex + $i),
                    'status' => 'متاح',
                ]);

                $buses[] = $bus;
            }
        }

        $drivers = [];
        foreach ($createdOffices as $officeIndex => $office) {
            for ($i = 1; $i <= 4; $i++) {
                $driver = Driver::create([
                    'office_id' => $office->id,
                    'name' => 'سائق ' . ($i + $officeIndex),
                    'phone' => '099333333' . ($officeIndex + $i),
                    'national_id' => '100' . ($officeIndex + 1) . '000' . $i,
                    'license_number' => 'LIC-' . ($officeIndex + 1) . $i,
                    'status' => 'متاح',
                ]);

                $drivers[] = $driver;
            }
        }

        $tripCount = 0;
        foreach ($createdOffices as $officeIndex => $office) {
            $officeBuses = Bus::where('office_id', $office->id)->get();
            $officeDrivers = Driver::where('office_id', $office->id)->get();

            foreach ($officeBuses as $index => $bus) {
                $tripCount++;
                $driver = $officeDrivers[$index % count($officeDrivers)];
                $assistantDriver = $officeDrivers[($index + 1) % count($officeDrivers)];

                $trip = Trip::create([
                    'office_id' => $office->id,
                    'bus_id' => $bus->id,
                    'driver_id' => $driver->id,
                    'assistant_driver_id' => $assistantDriver->id,
                    'from_governorate' => ['دمشق', 'حلب', 'حمص'][($officeIndex + $index) % 3],
                    'to_governorate' => ['حماة', 'اللاذقية', 'درعا'][($officeIndex + $index + 1) % 3],
                    'departure_date' => now()->addDays($tripCount % 4),
                    'departure_time' => '08:00:00',
                    'arrival_time' => '12:00:00',
                    'is_recurring' => false,
                    'seat_price' => 4500,
                    'vip_seat_price' => 6500,
                    'booking_closes_minutes_before' => 30,
                    'available_seats' => 24,
                    'status' => 'published',
                ]);

                for ($seatNo = 1; $seatNo <= $trip->available_seats; $seatNo++) {
                    $trip->seats()->create([
                        'seat_number' => $seatNo . 'A',
                        'status' => 'available',
                    ]);
                }
            }
        }

        $trip = Trip::first();
        $booking = Booking::create([
            'user_id' => $passenger->id,
            'trip_id' => $trip->id,
            'booking_code' => 'TRP-' . random_int(100000, 999999),
            'seats_count' => 2,
            'total_amount' => 9000,
            'status' => 'confirmed',
        ]);

        $seats = $trip->seats()->limit(2)->get();
        foreach ($seats as $seat) {
            $seat->update(['status' => 'booked', 'booking_id' => $booking->id]);
        }
    }
}
