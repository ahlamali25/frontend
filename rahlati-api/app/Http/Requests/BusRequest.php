<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fleet_number' => ['required', 'string', 'max:255', 'unique:buses,fleet_number' . ($this->route('bus') ? ',' . $this->route('bus')->id : '')],
            'plate_number' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:VIP,سياحي'],
            'model' => ['required', 'string', 'max:255'],
            'year' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'seat_layout' => ['required', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],
            'driver_id' => ['nullable', 'exists:drivers,id'],
            'status' => ['nullable', 'in:متاح,في رحلة,صيانة'],
        ];
    }

    public function messages(): array
    {
        return [
            'fleet_number.required' => 'رقم الأسطول مطلوب.',
            'fleet_number.unique' => 'رقم الأسطول مستخدم سابقًا.',
            'plate_number.required' => 'رقم اللوحة مطلوب.',
            'name.required' => 'اسم الحافلة مطلوب.',
            'type.in' => 'نوع الحافلة غير صالح.',
            'capacity.required' => 'سعة الحافلة مطلوبة.',
            'seat_layout.required' => 'تخطيط المقاعد مطلوب.',
            'driver_id.exists' => 'السائق المحدد غير موجود.',
            'status.in' => 'حالة الحافلة غير صالحة.',
        ];
    }
}
