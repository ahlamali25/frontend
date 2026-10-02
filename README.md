# رحلتي (Rahlaty)

## بنية المشروع


myproject/
├── rahlati-api/      # Laravel Backend
└── gamenextjs/       # Next.js Frontend


# تشغيل Backend

انتقل إلى مجلد Laravel:


cd rahlati-api


ثبّت مكتبات PHP:


composer install


أنشئ ملف البيئة:


cp .env.example .env


ثم:


php artisan key:generate


## إعداد قاعدة البيانات

أنشئ قاعدة بيانات MySQL باسم:


rahlati


ثم تأكد من إعدادات قاعدة البيانات داخل ملف `.env`:


DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rahlati
DB_USERNAME=root
DB_PASSWORD=


بعد ذلك شغّل الـ migrations والبيانات التجريبية:


php artisan migrate --seed


شغّل Laravel:


php artisan serve


# تشغيل Frontend

افتح Terminal جديد مع إبقاء Laravel يعمل.

انتقل إلى مجلد Next.js:


cd gamenextjs


ثبّت المكتبات:


npm install


أنشئ ملف:


.env.local


وأضف إليه:


NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api


ثم شغّل المشروع:


npm run dev


بعدها افتح:


http://localhost:3000


---

# الحسابات التجريبية

## حساب مستخدم عادي


Email: passenger@example.com
Password: password


## حسابات المكاتب

### المكتب الأول


Email: admin1@example.com
Password: password


### المكتب الثاني


Email: admin2@example.com
Password: password


### المكتب الثالث


Email: admin3@example.com
Password: password


---

# أهم وظائف المشروع

## للمسافر

* إنشاء حساب وتسجيل الدخول.
* تصفح مكاتب النقل والبحث عنها.
* البحث عن الرحلات.
* عرض تفاصيل الرحلة ووقت الانطلاق والوصول.
* حجز المقاعد في الرحلة.
* عرض الحجوزات والرحلات الخاصة به.
* إمكانية تسجيل الخروج.

## لصاحب المكتب

* تسجيل الدخول إلى حساب المكتب.
* إدارة بيانات المكتب.
* إضافة الرحلات.
* إدارة الحافلات.
* إدارة السائقين.
* متابعة الحجوزات الخاصة بالمكتب.

---
