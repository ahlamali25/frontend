<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Booking $booking, Request $request)
    {
        if ($request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'غير مصرح لك بعرض مدفوعات هذا الحجز.'], 403);
        }

        return response()->json($booking->payment()->get());
    }

    public function store(PaymentRequest $request, Booking $booking)
    {
        if ($request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'غير مصرح لك بدفع هذا الحجز.'], 403);
        }

        $payment = DB::transaction(function () use ($booking, $request) {
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'payment_method' => 'sham_cash',
                'sender_account' => $request->sender_account,
                'receiver_account' => config('rahlati.payment.receiver_account'),
                'amount' => $booking->total_amount,
                'transaction_reference' => 'SC-' . random_int(100000, 999999),
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            $booking->update(['status' => 'confirmed']);

            return $payment;
        });

        return response()->json([
            'message' => 'تم إنشاء الدفع بنجاح.',
            'payment' => $payment,
        ], 201);
    }
}
