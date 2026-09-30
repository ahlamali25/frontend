<?php

namespace App\Http\Controllers;

use App\Http\Requests\OfficeRequest;
use App\Models\Booking;
use App\Models\Office;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OfficeController extends Controller
{
public function index(Request $request)
{
    $search = $request->query('search');

    $query = Office::query()
        ->withCount([
            'trips as trips_count' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            },
        ]);

    if ($search) {
        $query->where('name', 'like', '%' . $search . '%');
    }

    return response()->json($query->get());
}

    public function show(Office $office)
    {
        return response()->json($office->load(['owner', 'buses', 'drivers', 'trips']));
    }

    public function store(OfficeRequest $request)
    {
        $office = Office::create($request->validated());

        $user = Auth::user();
        $user->update([
            'role' => 'office_admin',
            'office_id' => $office->id,
        ]);

        return response()->json([
            'message' => 'تم إنشاء المكتب بنجاح.',
            'office' => $office,
        ], 201);
    }

    public function update(OfficeRequest $request, Office $office)
    {
        if (Auth::id() !== $office->owner?->id) {
            return response()->json(['message' => 'غير مصرح لك بتحديث هذا المكتب.'], 403);
        }

        $office->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث المكتب بنجاح.',
            'office' => $office,
        ]);
    }

    public function destroy(Office $office)
    {
        if (Auth::id() !== $office->owner?->id) {
            return response()->json(['message' => 'غير مصرح لك بحذف هذا المكتب.'], 403);
        }

        $office->delete();

        return response()->json([
            'message' => 'تم حذف المكتب بنجاح.',
        ]);
    }

    public function dashboard(Request $request)
{
    $user = $request->user();

    if ($user->role !== 'office_admin') {
        return response()->json([
            'message' => 'غير مصرح لك بالوصول إلى لوحة تحكم المكتب.'
        ], 403);
    }

    $office = $user->office;

    if (!$office) {
        return response()->json([
            'message' => 'ليس لديك مكتب مرتبط.'
        ], 403);
    }

        $bookings = Booking::whereHas('trip', fn ($query) => $query->where('office_id', $office->id))->get();

        $recentTrips = Trip::where('office_id', $office->id)
            ->orderByDesc('departure_date')
            ->orderByDesc('departure_time')
            ->take(4)
            ->get(['id', 'from_governorate', 'to_governorate', 'departure_time', 'departure_date', 'seat_price', 'status']);

        $routeDistribution = Trip::where('office_id', $office->id)
            ->selectRaw('from_governorate, to_governorate, count(*) as count')
            ->groupBy('from_governorate', 'to_governorate')
            ->orderByDesc('count')
            ->get();

        $topRoutes = $routeDistribution->take(4)->values();
        $otherCount = $routeDistribution->slice(4)->sum('count');

        if ($otherCount > 0) {
            $topRoutes->push([
                'from_governorate' => 'أخرى',
                'to_governorate' => '',
                'count' => $otherCount,
            ]);
        }

        return response()->json([
            'office' => [
                'id' => $office->id,
                'name' => $office->name,
                'phone' => $office->phone,
                'address' => $office->address,
            ],
            'total_revenue' => $bookings->where('status', 'confirmed')->sum('total_amount'),
            'bookings_count' => $bookings->count(),
            'reserved_seats' => $bookings->where('status', '!=', 'cancelled')->sum('seats_count'),
            'trips_count' => Trip::where('office_id', $office->id)->count(),
            'recent_trips' => $recentTrips,
            'route_distribution' => $topRoutes,
        ]);
    }
}
