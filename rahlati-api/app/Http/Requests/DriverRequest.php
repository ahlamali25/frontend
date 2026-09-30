<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DriverRequest extends FormRequest
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
            'national_id' => ['required', 'string', 'max:255'],
            'license_number' => ['required', 'string', 'max:255'],
            'assigned_bus_id' => ['nullable', 'exists:buses,id'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:متاح,في رحلة,غير متاح'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'اسم السائق مطلوب.',
            'phone.required' => 'هاتف السائق مطلوب.',
            'national_id.required' => 'الهوية الوطنية مطلوبة.',
            'license_number.required' => 'رقم الرخصة مطلوب.',
            'assigned_bus_id.exists' => 'الحافلة المحددة غير موجودة.',
            'status.in' => 'حالة السائق غير صالحة.',
        ];
    }
}
