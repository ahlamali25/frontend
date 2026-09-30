<?php

namespace App\Http\Controllers;

use App\Http\Requests\BusRequest;
use App\Models\Bus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BusController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Bus::where('office_id', $request->user()->office_id)->get());
    }

    public function show(Bus $bus, Request $request)
    {
        if ($request->user()->office_id !== $bus->office_id) {
            return response()->json(['message' => 'غير مصرح لك بعرض هذه الحافلة.'], 403);
        }

        return response()->json($bus);
    }

    public function store(BusRequest $request)
    {
        $bus = Bus::create([
            ...$request->validated(),
            'office_id' => $request->user()->office_id,
        ]);

        return response()->json([
            'message' => 'تم إنشاء الحافلة بنجاح.',
            'bus' => $bus,
        ], 201);
    }

    public function update(BusRequest $request, Bus $bus)
    {
        if ($request->user()->office_id !== $bus->office_id) {
            return response()->json(['message' => 'غير مصرح لك بتحديث هذه الحافلة.'], 403);
        }

        $bus->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الحافلة بنجاح.',
            'bus' => $bus,
        ]);
    }

    public function destroy(Bus $bus, Request $request)
    {
        if ($request->user()->office_id !== $bus->office_id) {
            return response()->json(['message' => 'غير مصرح لك بحذف هذه الحافلة.'], 403);
        }

        $bus->delete();

        return response()->json([
            'message' => 'تم حذف الحافلة بنجاح.',
        ]);
    }
}
