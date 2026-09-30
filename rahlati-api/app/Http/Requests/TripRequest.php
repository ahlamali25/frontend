<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TripRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $officeId = $this->user()?->office_id;

        return [
            'bus_id' => [
                'required',
                Rule::exists('buses', 'id')
                    ->where(fn ($query) => $query->where('office_id', $officeId)),
            ],

            'driver_id' => [
                'required',
                Rule::exists('drivers', 'id')
                    ->where(fn ($query) => $query->where('office_id', $officeId)),
            ],

            'assistant_driver_id' => [
                'required',
                'different:driver_id',
                Rule::exists('drivers', 'id')
                    ->where(fn ($query) => $query->where('office_id', $officeId)),
            ],

            'from_governorate' => [
                'required',
                'in:' . implode(',', config('rahlati.governorates')),
            ],

            'to_governorate' => [
                'required',
                'in:' . implode(',', config('rahlati.governorates')),
            ],

            'departure_date' => [
                'required',
                'date',
            ],

            'departure_time' => [
                'required',
                'date_format:H:i',
            ],

            'arrival_time' => [
                'required',
                'date_format:H:i',
            ],

            'is_recurring' => [
                'nullable',
                'boolean',
            ],

            'recurring_days' => [
                'nullable',
                'array',
            ],

            'seat_price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'vip_seat_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'booking_closes_minutes_before' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'available_seats' => [
                'required',
                'integer',
                'min:1',
            ],

            'status' => [
                'nullable',
                'in:draft,published,booking_open,booking_closed,departed,completed,cancelled',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'bus_id.required' => 'يجب اختيار المركبة.',
            'bus_id.exists' => 'المركبة المحددة غير موجودة أو لا تتبع مكتبك.',

            'driver_id.required' => 'يجب اختيار السائق الأساسي.',
            'driver_id.exists' => 'السائق المحدد غير موجود أو لا يتبع مكتبك.',

            'assistant_driver_id.required' => 'يجب اختيار السائق المساعد.',
            'assistant_driver_id.exists' => 'السائق المساعد غير موجود أو لا يتبع مكتبك.',
            'assistant_driver_id.different' => 'يجب أن يكون السائق المساعد مختلفًا عن السائق الأساسي.',

            'from_governorate.required' => 'المحافظة المصدر مطلوبة.',
            'from_governorate.in' => 'المحافظة المصدر غير صالحة.',

            'to_governorate.required' => 'المحافظة الوجهة مطلوبة.',
            'to_governorate.in' => 'المحافظة الوجهة غير صالحة.',

            'departure_date.required' => 'تاريخ الرحلة مطلوب.',

            'departure_time.required' => 'وقت الانطلاق مطلوب.',
            'departure_time.date_format' => 'صيغة وقت الانطلاق غير صحيحة.',

            'arrival_time.required' => 'وقت الوصول مطلوب.',
            'arrival_time.date_format' => 'صيغة وقت الوصول غير صحيحة.',

            'seat_price.required' => 'سعر المقعد مطلوب.',
            'seat_price.numeric' => 'سعر المقعد يجب أن يكون رقمًا.',

            'available_seats.required' => 'عدد المقاعد المتاحة مطلوب.',
            'available_seats.integer' => 'عدد المقاعد يجب أن يكون رقمًا صحيحًا.',
            'available_seats.min' => 'يجب أن يحتوي الباص على مقعد واحد على الأقل.',

            'status.in' => 'حالة الرحلة غير صالحة.',
        ];
    }
}