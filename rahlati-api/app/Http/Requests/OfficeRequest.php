<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:active,suspended'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'اسم المكتب مطلوب.',
            'phone.required' => 'هاتف المكتب مطلوب.',
            'address.required' => 'عنوان المكتب مطلوب.',
            'rating.numeric' => 'التقييم يجب أن يكون رقمًا.',
            'status.in' => 'الحالة غير صالحة.',
        ];
    }
}
