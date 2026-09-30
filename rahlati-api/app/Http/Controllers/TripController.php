<?php

namespace App\Http\Controllers;

use App\Http\Requests\TripRequest;
use App\Models\Seat;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripController extends Controller
{
   public function search(Request $request)
{
    $query = Trip::query()
        ->where('status', '!=', 'cancelled')
        ->with(['bus', 'driver', 'assistantDriver', 'office']);
        $query->where(function ($query) {
    $query->whereDate('departure_date', '>', now()->toDateString())
        ->orWhere(function ($query) {
            $query->whereDate('departure_date', now()->toDateString())
                ->whereTime('departure_time', '>=', now()->format('H:i:s'));
        });
});

    if ($request->filled('from_governorate')) {
        $query->where(
            'from_governorate',
            $request->from_governorate
        );
    }

    if ($request->filled('to_governorate')) {
        $query->where(
            'to_governorate',
            $request->to_governorate
        );
    }

    if ($request->filled('departure_date')) {
        $query->where(
            'departure_date',
            $request->departure_date
        );
    }

    if ($request->filled('office_id')) {
        $query->where(
            'office_id',
            $request->office_id
        );
    }

    return response()->json($query->get());
}

    public function seats(Trip $trip)
    {
        return response()->json($trip->seats()->get());
    }

public function index(Request $request)
{
    $user = $request->user();

    $query = Trip::query()
        ->where('office_id', $user->office_id);

    if ($request->filled('from_date')) {
        $query->where('departure_date', '>=', $request->from_date);
    }

    if ($request->filled('to_date')) {
        $query->where('departure_date', '<=', $request->to_date);
    }

    if ($request->filled('from_governorate')) {
        $query->where('from_governorate', $request->from_governorate);
    }

    if ($request->filled('to_governorate')) {
        $query->where('to_governorate', $request->to_governorate);
    }

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    $trips = $query
        ->with(['bus', 'driver', 'assistantDriver'])
        ->withCount('bookings')
        ->get();

    $stats = [
        'total' => $trips->count(),

        'confirmed' => $trips
            ->where('status', 'published')
            ->count(),

        'revenue' => $trips->sum(
            fn ($trip) => $trip->seat_price * $trip->bookings_count
        ),
    ];

    return response()->json([
        'trips' => $trips,
        'stats' => $stats,
    ]);
}

    public function show(Trip $trip)
    {
        return response()->json($trip->load(['bus', 'driver', 'assistantDriver', 'office']));
    }

    public function store(TripRequest $request)
    {
        $user = $request->user();
        $officeId = $user->office_id;

        $trip = Trip::create([
            ...$request->validated(),
            'office_id' => $officeId,
            'status' => 'published',
        ]);

        $seatsToCreate = [];
        for ($i = 1; $i <= $request->available_seats; $i++) {
            $seatsToCreate[] = [
                'trip_id' => $trip->id,
                'seat_number' => $i . 'A',
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Seat::insert($seatsToCreate);

        return response()->json([
            'message' => 'تم إنشاء الرحلة بنجاح.',
            'trip' => $trip,
        ], 201);
    }

    public function update(TripRequest $request, Trip $trip)
    {
        if ($request->user()->office_id !== $trip->office_id) {
            return response()->json(['message' => 'غير مصرح لك بتحديث هذه الرحلة.'], 403);
        }

        $trip->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الرحلة بنجاح.',
            'trip' => $trip,
        ]);
    }

    public function destroy(Trip $trip, Request $request)
    {
        if ($request->user()->office_id !== $trip->office_id) {
            return response()->json(['message' => 'غير مصرح لك بحذف هذه الرحلة.'], 403);
        }

        $trip->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'تم إلغاء الرحلة بنجاح.',
        ]);
    }
}
