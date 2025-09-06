<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'الحقل :attribute يجب أن يتم قبوله.',
    'accepted_if' => 'الحقل :attribute يجب أن يتم قبوله عندما يكون :other هو :value.',
    'active_url' => 'الحقل :attribute يجب أن يكون رابط صالح.',
    'after' => 'الحقل :attribute يجب أن يكون تاريخ بعد :date.',
    'after_or_equal' => 'الحقل :attribute يجب أن يكون تاريخ بعد أو يساوي :date.',
    'alpha' => 'الحقل :attribute يجب أن يحتوي على حروف فقط.',
    'alpha_dash' => 'الحقل :attribute يجب أن يحتوي على حروف، أرقام، شرطات وشرطات سفلية فقط.',
    'alpha_num' => 'الحقل :attribute يجب أن يحتوي على حروف وأرقام فقط.',
    'any_of' => 'الحقل :attribute غير صالح.',
    'array' => 'الحقل :attribute يجب أن يكون مصفوفة.',
    'ascii' => 'الحقل :attribute يجب أن يحتوي على أحرف ورموز أحادية البايت فقط.',
    'before' => 'الحقل :attribute يجب أن يكون تاريخ قبل :date.',
    'before_or_equal' => 'الحقل :attribute يجب أن يكون تاريخ قبل أو يساوي :date.',
    'between' => [
        'array' => 'الحقل :attribute يجب أن يحتوي بين :min و :max عناصر.',
        'file' => 'الحقل :attribute يجب أن يكون بين :min و :max كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون بين :min و :max.',
        'string' => 'الحقل :attribute يجب أن يحتوي بين :min و :max حروف.',
    ],
    'boolean' => 'الحقل :attribute يجب أن يكون صحيح أو خطأ.',
    'can' => 'الحقل :attribute يحتوي على قيمة غير مصرح بها.',
    'confirmed' => 'تأكيد الحقل :attribute غير متطابق.',
    'contains' => 'الحقل :attribute مفقود قيمة مطلوبة.',
    'current_password' => 'كلمة المرور غير صحيحة.',
    'date' => 'الحقل :attribute يجب أن يكون تاريخ صالح.',
    'date_equals' => 'الحقل :attribute يجب أن يكون تاريخ يساوي :date.',
    'date_format' => 'الحقل :attribute يجب أن يطابق الصيغة :format.',
    'decimal' => 'الحقل :attribute يجب أن يحتوي على :decimal منازل عشرية.',
    'declined' => 'الحقل :attribute يجب رفضه.',
    'declined_if' => 'الحقل :attribute يجب رفضه عندما يكون :other هو :value.',
    'different' => 'الحقل :attribute و :other يجب أن يكونا مختلفين.',
    'digits' => 'الحقل :attribute يجب أن يكون :digits أرقام.',
    'digits_between' => 'الحقل :attribute يجب أن يكون بين :min و :max أرقام.',
    'dimensions' => 'الحقل :attribute له أبعاد صورة غير صالحة.',
    'distinct' => 'الحقل :attribute له قيمة مكررة.',
    'doesnt_contain' => 'الحقل :attribute يجب ألا يحتوي على: :values.',
    'doesnt_end_with' => 'الحقل :attribute يجب ألا ينتهي بواحدة من: :values.',
    'doesnt_start_with' => 'الحقل :attribute يجب ألا يبدأ بواحدة من: :values.',
    'email' => 'الحقل :attribute يجب أن يكون بريدًا إلكترونيًا صالحًا.',
    'ends_with' => 'الحقل :attribute يجب أن ينتهي بواحدة من: :values.',
    'enum' => 'الحقل :attribute المحدد غير صالح.',
    'exists' => 'الحقل :attribute المحدد غير صالح.',
    'extensions' => 'الحقل :attribute يجب أن يكون له امتداد من: :values.',
    'file' => 'الحقل :attribute يجب أن يكون ملفًا.',
    'filled' => 'الحقل :attribute يجب أن يحتوي على قيمة.',
    'gt' => [
        'array' => 'الحقل :attribute يجب أن يحتوي على أكثر من :value عناصر.',
        'file' => 'الحقل :attribute يجب أن يكون أكبر من :value كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون أكبر من :value.',
        'string' => 'الحقل :attribute يجب أن يحتوي على أكثر من :value حروف.',
    ],
    'gte' => [
        'array' => 'الحقل :attribute يجب أن يحتوي على :value عناصر أو أكثر.',
        'file' => 'الحقل :attribute يجب أن يكون أكبر من أو يساوي :value كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون أكبر من أو يساوي :value.',
        'string' => 'الحقل :attribute يجب أن يحتوي على أكثر من أو يساوي :value حروف.',
    ],
    'hex_color' => 'الحقل :attribute يجب أن يكون لونًا سداسيًا صحيحًا.',
    'image' => 'الحقل :attribute يجب أن يكون صورة.',
    'in' => 'الحقل :attribute المحدد غير صالح.',
    'in_array' => 'الحقل :attribute يجب أن يكون موجودًا في :other.',
    'in_array_keys' => 'الحقل :attribute يجب أن يحتوي على مفتاح واحد على الأقل من: :values.',
    'integer' => 'الحقل :attribute يجب أن يكون عددًا صحيحًا.',
    'ip' => 'الحقل :attribute يجب أن يكون عنوان IP صالح.',
    'ipv4' => 'الحقل :attribute يجب أن يكون عنوان IPv4 صالح.',
    'ipv6' => 'الحقل :attribute يجب أن يكون عنوان IPv6 صالح.',
    'json' => 'الحقل :attribute يجب أن يكون سلسلة JSON صالحة.',
    'list' => 'الحقل :attribute يجب أن يكون قائمة.',
    'lowercase' => 'الحقل :attribute يجب أن يكون أحرف صغيرة.',
    'lt' => [
        'array' => 'الحقل :attribute يجب أن يحتوي على أقل من :value عناصر.',
        'file' => 'الحقل :attribute يجب أن يكون أقل من :value كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون أقل من :value.',
        'string' => 'الحقل :attribute يجب أن يحتوي على أقل من :value حروف.',
    ],
    'lte' => [
        'array' => 'الحقل :attribute يجب ألا يحتوي على أكثر من :value عناصر.',
        'file' => 'الحقل :attribute يجب أن يكون أقل من أو يساوي :value كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون أقل من أو يساوي :value.',
        'string' => 'الحقل :attribute يجب أن يحتوي على أقل من أو يساوي :value حروف.',
    ],
    'mac_address' => 'الحقل :attribute يجب أن يكون عنوان MAC صالحًا.',
    'max' => [
        'array' => 'الحقل :attribute يجب ألا يحتوي على أكثر من :max عناصر.',
        'file' => 'الحقل :attribute يجب ألا يكون أكبر من :max كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب ألا يكون أكبر من :max.',
        'string' => 'الحقل :attribute يجب ألا يحتوي على أكثر من :max حروف.',
    ],
    'max_digits' => 'الحقل :attribute يجب ألا يحتوي على أكثر من :max أرقام.',
    'mimes' => 'الحقل :attribute يجب أن يكون ملفًا من نوع: :values.',
    'mimetypes' => 'الحقل :attribute يجب أن يكون ملفًا من نوع: :values.',
    'min' => [
        'array' => 'الحقل :attribute يجب أن يحتوي على الأقل :min عناصر.',
        'file' => 'الحقل :attribute يجب أن يكون على الأقل :min كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون على الأقل :min.',
        'string' => 'الحقل :attribute يجب أن يحتوي على الأقل :min حروف.',
    ],
    'min_digits' => 'الحقل :attribute يجب أن يحتوي على الأقل :min أرقام.',
    'missing' => 'الحقل :attribute يجب أن يكون مفقودًا.',
    'missing_if' => 'الحقل :attribute يجب أن يكون مفقودًا عندما يكون :other هو :value.',
    'missing_unless' => 'الحقل :attribute يجب أن يكون مفقودًا إلا إذا كان :other هو :value.',
    'missing_with' => 'الحقل :attribute يجب أن يكون مفقودًا عندما يكون :values موجود.',
    'missing_with_all' => 'الحقل :attribute يجب أن يكون مفقودًا عندما تكون :values موجودة.',
    'multiple_of' => 'الحقل :attribute يجب أن يكون مضاعفًا للـ :value.',
    'not_in' => 'الحقل :attribute المحدد غير صالح.',
    'not_regex' => 'الحقل :attribute يحتوي على صيغة غير صالحة.',
    'numeric' => 'الحقل :attribute يجب أن يكون رقمًا.',
    'password' => [
        'letters' => 'الحقل :attribute يجب أن يحتوي على حرف واحد على الأقل.',
        'mixed' => 'الحقل :attribute يجب أن يحتوي على حرف كبير وحرف صغير على الأقل.',
        'numbers' => 'الحقل :attribute يجب أن يحتوي على رقم واحد على الأقل.',
        'symbols' => 'الحقل :attribute يجب أن يحتوي على رمز واحد على الأقل.',
        'uncompromised' => 'الحقل :attribute الذي أدخلته تم تسريبه مسبقًا. يرجى اختيار قيمة مختلفة.',
    ],
    'present' => 'الحقل :attribute يجب أن يكون موجودًا.',
    'present_if' => 'الحقل :attribute يجب أن يكون موجودًا عندما يكون :other هو :value.',
    'present_unless' => 'الحقل :attribute يجب أن يكون موجودًا إلا إذا كان :other هو :value.',
    'present_with' => 'الحقل :attribute يجب أن يكون موجودًا عندما يكون :values موجود.',
    'present_with_all' => 'الحقل :attribute يجب أن يكون موجودًا عندما تكون :values موجودة.',
    'prohibited' => 'الحقل :attribute محظور.',
    'prohibited_if' => 'الحقل :attribute محظور عندما يكون :other هو :value.',
    'prohibited_if_accepted' => 'الحقل :attribute محظور عندما يتم قبول :other.',
    'prohibited_if_declined' => 'الحقل :attribute محظور عندما يتم رفض :other.',
    'prohibited_unless' => 'الحقل :attribute محظور إلا إذا كان :other ضمن :values.',
    'prohibits' => 'الحقل :attribute يمنع وجود :other.',
    'regex' => 'الحقل :attribute يحتوي على صيغة غير صالحة.',
    'required' => 'الحقل :attribute مطلوب.',
    'required_array_keys' => 'الحقل :attribute يجب أن يحتوي على المفاتيح: :values.',
    'required_if' => 'الحقل :attribute مطلوب عندما يكون :other هو :value.',
    'required_if_accepted' => 'الحقل :attribute مطلوب عندما يتم قبول :other.',
    'required_if_declined' => 'الحقل :attribute مطلوب عندما يتم رفض :other.',
    'required_unless' => 'الحقل :attribute مطلوب إلا إذا كان :other ضمن :values.',
    'required_with' => 'الحقل :attribute مطلوب عندما يكون :values موجود.',
    'required_with_all' => 'الحقل :attribute مطلوب عندما تكون :values موجودة.',
    'required_without' => 'الحقل :attribute مطلوب عندما لا يكون :values موجود.',
    'required_without_all' => 'الحقل :attribute مطلوب عندما لا يكون أي من :values موجود.',
    'same' => 'الحقل :attribute يجب أن يطابق :other.',
    'size' => [
        'array' => 'الحقل :attribute يجب أن يحتوي على :size عناصر.',
        'file' => 'الحقل :attribute يجب أن يكون :size كيلوبايت.',
        'numeric' => 'الحقل :attribute يجب أن يكون :size.',
        'string' => 'الحقل :attribute يجب أن يحتوي على :size حروف.',
    ],
    'starts_with' => 'الحقل :attribute يجب أن يبدأ بواحدة من: :values.',
    'string' => 'الحقل :attribute يجب أن يكون نصًا.',
    'timezone' => 'الحقل :attribute يجب أن يكون منطقة زمنية صالحة.',
    'unique' => 'الحقل :attribute مُستخدم مسبقًا.',
    'uploaded' => 'فشل تحميل الحقل :attribute.',
    'uppercase' => 'الحقل :attribute يجب أن يكون أحرف كبيرة.',
    'url' => 'الحقل :attribute يجب أن يكون رابط صالح.',
    'ulid' => 'الحقل :attribute يجب أن يكون ULID صالح.',
    'uuid' => 'الحقل :attribute يجب أن يكون UUID صالح.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
