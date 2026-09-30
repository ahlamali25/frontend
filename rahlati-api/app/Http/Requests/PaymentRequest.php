<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender_account' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'sender_account.required' => 'حقل sender_account مطلوب.',
        ];
    }
}
