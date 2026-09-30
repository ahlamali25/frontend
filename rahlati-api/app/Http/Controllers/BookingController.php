<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use App\Models\Booking;
use App\Models\Seat;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function userBookings(Request $request)
    {
        return response()->json(
            Booking::where('user_id', $request->user()->id)
                ->with(['trip.bus', 'trip.office', 'payment'])
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function officeBookings(Request $request)
    {
        $query = Booking::query()
            ->with(['user', 'trip', 'payment'])
            ->whereHas('trip', function ($tripQuery) use ($request) {
                $tripQuery->where(
                    'office_id',
                    $request->user()->office_id
                );
            });

        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        if ($request->filled('date_from')) {
            $query->whereHas('trip', function ($tripQuery) use ($request) {
                $tripQuery->whereDate(
                    'departure_date',
                    '>=',
                    $request->date_from
                );
            });
        }

        if ($request->filled('date_to')) {
            $query->whereHas('trip', function ($tripQuery) use ($request) {
                $tripQuery->whereDate(
                    'departure_date',
                    '<=',
                    $request->date_to
                );
            });
        }

        if ($request->filled('trip_id')) {
            $query->where('trip_id', $request->trip_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $totalBookings = (clone $query)->count();

        $confirmedBookings = (clone $query)
            ->whereIn('status', ['confirmed', 'completed'])
            ->count();

        $revenue = (clone $query)
            ->whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $bookings = $query
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json([
            'bookings' => $bookings,

            'stats' => [
                'total' => $totalBookings,
                'confirmed' => $confirmedBookings,
                'revenue' => $revenue,
            ],
        ]);
    }

    public function show(Booking $booking, Request $request)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'غير مصرح لك بعرض هذا الحجز',
            ], 403);
        }

        return response()->json(
            $booking->load([
                'trip.bus',
                'trip.office',
                'seats',
                'payment',
            ])
        );
    }

    public function store(BookingRequest $request)
    {
        $user = $request->user();

        $trip = Trip::lockForUpdate()
            ->findOrFail($request->trip_id);

        $seatNumbers = $request->seat_numbers;

        if (count($seatNumbers) < 1) {
            return response()->json([
                'message' => 'يجب تحديد مقعد واحد على الأقل.',
            ], 422);
        }

        $existingSeat = Seat::where('trip_id', $trip->id)
            ->whereIn('seat_number', $seatNumbers)
            ->where('status', 'booked')
            ->first();

        if ($existingSeat) {
            return response()->json([
                'message' => 'أحد المقاعد المختارة محجوز بالفعل.',
            ], 422);
        }

        $booking = DB::transaction(function () use (
            $user,
            $trip,
            $seatNumbers
        ) {
            $booking = Booking::create([
                'user_id' => $user->id,
                'trip_id' => $trip->id,
                'booking_code' => 'TRP-' . random_int(100000, 999999),
                'seats_count' => count($seatNumbers),
                'total_amount' => count($seatNumbers) * $trip->seat_price,
                'status' => 'pending',
            ]);

            foreach ($seatNumbers as $seatNumber) {
                Seat::where('trip_id', $trip->id)
                    ->where('seat_number', $seatNumber)
                    ->update([
                        'status' => 'booked',
                        'booking_id' => $booking->id,
                    ]);
            }

            return $booking;
        });

        return response()->json([
            'message' => 'تم إنشاء الحجز بنجاح.',
            'booking' => $booking,
        ], 201);
    }

    public function update(Booking $booking, Request $request)
    {
        if ($request->user()->id !== $booking->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك بتحديث هذا الحجز.',
            ], 403);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        foreach ($booking->seats as $seat) {
            $seat->update([
                'status' => 'available',
                'booking_id' => null,
            ]);
        }

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح.',
            'booking' => $booking,
        ]);
    }

    public function destroy(Booking $booking, Request $request)
    {
        if ($request->user()->id !== $booking->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك بحذف هذا الحجز.',
            ], 403);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        foreach ($booking->seats as $seat) {
            $seat->update([
                'status' => 'available',
                'booking_id' => null,
            ]);
        }

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح.',
        ]);
    }
}
