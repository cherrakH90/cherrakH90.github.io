# (إذا كنت تستخدم نفس المستودع القديم)
# احذف الملفات القديمة من ذاكرة Git المؤقتة
git rm -r .

# أضف كل ملفات مشروع React الجديد
git add .
git commit -m "Replace old code with new React/Tailwind structure"

# ارفع التغييرات
git push origin main 
