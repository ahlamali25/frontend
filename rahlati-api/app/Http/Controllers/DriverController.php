<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverRequest;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Driver::where('office_id', $request->user()->office_id)->get());
    }

    public function show(Driver $driver, Request $request)
    {
        if ($request->user()->office_id !== $driver->office_id) {
            return response()->json(['message' => 'غير مصرح لك بعرض هذا السائق.'], 403);
        }

        return response()->json($driver);
    }

    public function store(DriverRequest $request)
    {
        $driver = Driver::create([
            ...$request->validated(),
            'office_id' => $request->user()->office_id,
        ]);

        return response()->json([
            'message' => 'تم إنشاء السائق بنجاح.',
            'driver' => $driver,
        ], 201);
    }

    public function update(DriverRequest $request, Driver $driver)
    {
        if ($request->user()->office_id !== $driver->office_id) {
            return response()->json(['message' => 'غير مصرح لك بتحديث هذا السائق.'], 403);
        }

        $driver->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث السائق بنجاح.',
            'driver' => $driver,
        ]);
    }

    public function destroy(Driver $driver, Request $request)
    {
        if ($request->user()->office_id !== $driver->office_id) {
            return response()->json(['message' => 'غير مصرح لك بحذف هذا السائق.'], 403);
        }

        $driver->delete();

        return response()->json([
            'message' => 'تم حذف السائق بنجاح.',
        ]);
    }
}
