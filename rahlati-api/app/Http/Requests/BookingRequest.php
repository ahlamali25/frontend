<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'trip_id' => ['required', 'exists:trips,id'],
            'seat_numbers' => ['required', 'array'],
            'seat_numbers.*' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'trip_id.required' => 'حقل trip_id مطلوب.',
            'trip_id.exists' => 'الرحلة المحددة غير موجودة.',
            'seat_numbers.required' => 'يجب إرسال قائمة المقاعد.',
            'seat_numbers.array' => 'قائمة المقاعد يجب أن تكون مصفوفة.',
        ];
    }
}
