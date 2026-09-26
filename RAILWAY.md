# 🚀 دليل نشر موقع أفيا لينك (AVIALINK) على استضافة Railway

يقدم هذا الملف الخطوات العملية والنماذج الجاهزة لنشر تطبيق **AVIALINK Export Platform** على منصة **Railway (https://railway.com)** بأعلى أداء وسرعة وأمان.

---

## 📋 المميزات المجهزة للموقع على Railway
1. **الربط التلقائي للمنفذ (`PORT`):** يتعرف السيرفر تلقائياً على متغير المنفذ الديناميكي الخاص بـ Railway.
2. **الضغظ العالي للبيانات (Gzip Compression):** لرفع سرعة التحميل إلى أقصى حد.
3. **التخزين السريع للأصول (Browser Caching):** إعدادات هيدر متقدمة للأمان والسرعة.
4. **فحص الصحة الحية (Health Check Endpoint):** عبر الرابط `/api/health` للتحقق التلقائي من كفاءة السيرفر.
5. **إعدادات Nixpacks & Dockerfile جاهزة:** للبناء التلقائي بضغطة زر.

---

## 🛠️ خطوات النشر على Railway (Step-by-Step)

### الخطوة 1: رفع الكود على GitHub
تأكد من أن جميع الملفات مجهزة ومرفوعة على المستودع الخاص بك على GitHub:
```bash
git add .
git commit -m "Prepare site for Railway production deployment"
git push origin main
```

### الخطوة 2: إنشاء مشروع جديد على Railway
1. افتح حسابك على [Railway.com](https://railway.com).
2. انقر على **New Project**.
3. اختر **Deploy from GitHub repo**.
4. حدد مستودع **AviaLink-Export**.

### الخطوة 3: ضبط متغيرات البيئة (Environment Variables)
في لوحة تحكم المشروع على Railway، انتقل إلى تبويب **Variables** وأضف المتغيرات التالية:

| اسم المتغير (Variable Name) | القيمة الموصى بها (Value) | الوصف |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | وضع التشغيل الإنتاجي |
| `ADMIN_PASSWORD` | *كلمة سر القوية من اختيارك* | كلمة مرور لوحة تحكم الأدمن |
| `SUPABASE_URL` | *(اختياري)* | رابط قاعدة بيانات Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | *(اختياري)* | المفتاح السري لقاعدة البيانات |
| `GEMINI_API_KEY` | *(اختياري)* | مفتاح المساعد الذكي Gemini AI |

*ملاحظة: يتولى Railway إسناد متغير `PORT` تلقائياً.*

### الخطوة 4: توليد رابط الموقع (Generate Domain)
1. من لوحة مشروعك على Railway، انتقل إلى تبويب **Settings**.
2. في قسم **Networking / Environment Domains**، انقر على **Generate Domain** أو قم بربط دومينك الخاص (Custom Domain) مثل `avialink-eg.com`.

---

## ✅ التحقق من سلامة النشر
يمكنك التأكد من عمل السيرفر بكفاءة عبر فتح الرابط التالي في المتصفح:
`https://your-app-name.up.railway.app/api/health`

سيرد السيرفر باستجابة JSON فورية:
```json
{
  "status": "ok",
  "service": "AVIALINK Backend Service",
  "time": "2026-09-16T19:00:00.000Z"
}
```

مبروك! موقع أفيا لينك الآن يعمل بكامل طاقته وسرعته على Railway! 🎉
