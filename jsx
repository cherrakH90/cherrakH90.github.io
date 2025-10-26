import React, { useEffect, useState } from 'react';
import GlobeIcon from 'lucide-react/dist/esm/icons/globe';
import ClockIcon from 'lucide-react/dist/esm/icons/clock';
import QrCode from 'lucide-react/dist/esm/icons/qrCode'; // استيراد أيقونة الكود QR

// ملاحظة: تأكد من تثبيت مكتبة lucide-react لتشغيل الأيقونات: npm install lucide-react

const Hero = () => {
  // للتحكم في حالة التحقق والبدء
  const [isVerifying, setIsVerifying] = useState(false);
  const [globalTime, setGlobalTime] = useState('');

  // لتحديث التوقيت العالمي (لإضفاء طابع عالمي)
  useEffect(() => {
    const updateTime = () => {
      setGlobalTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT' }));
    };
    const timer = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(timer);
  }, []);

  const handleStartJourney = () => {
    setIsVerifying(true);
    // محاكاة عملية تحقق سريعة (بصمة + QR)
    setTimeout(() => {
      alert("تم التحقق بنجاح! مرحباً بك في الخزنة العالمية.");
      // هنا يمكنك إضافة منطق التوجيه إلى الصفحة التالية
      setIsVerifying(false);
    }, 2500);
  };

  return (
    // خلفية فضائية داكنة فخمة
    <header className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4 pt-20 overflow-hidden relative">
      
      {/* تأثير شبكي خلفي (مستقبلي) */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#4c1d95_1px,transparent_1px),radial-gradient(#4c1d95_1px,transparent_1px)] [background-size:60px_60px] [background-position:0_0,30px_30px]"></div>
      
      {/* معلومات التوقيت والقمر الصناعي */}
      <div className="absolute top-4 right-4 text-sm text-yellow-400 flex flex-col items-end z-10" dir="rtl">
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4 text-purple-400" />
          <span>التوقيت العالمي (GMT): {globalTime}</span>
        </div>
        <div className="text-gray-400 text-xs mt-1 flex items-center space-x-1">
            <GlobeIcon className="w-3 h-3 text-green-400"/>
            <span>قمر Cherrak Houari الصناعي</span>
        </div>
      </div>
      
      {/* المحتوى المركزي */}
      <div className="text-center z-10 max-w-4xl mx-auto" dir="rtl">
        
        {/* العنوان الرئيسي */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight" style={{ 
          backgroundImage: 'linear-gradient(45deg, #FFD700, #9B59B6, #FFFFFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Cherrak Infinity ♾️ AI
        </h1>

        {/* الشرح الثانوي */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
          الخزنة العالمية الضخمة المتطورة: عالم واحد يجمع المعرفة، الذكاء، والابتكار.
        </p>
        
        {/* زر البوابة/البصمة */}
        <button 
          onClick={handleStartJourney}
          disabled={isVerifying}
          className={`
            px-12 py-4 text-lg font-bold rounded-full shadow-2xl transition duration-500 transform hover:scale-105
            ${isVerifying ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-400/50'}
          `}
        >
          {isVerifying ? 'جاري التحقق (QR + البصمة)...' : 'ابدأ رحلتك الآن عبر البوابة الذكية (بصمة الإصبع + QR) '}
        </button>
        
        {/* كلمة المرور و الإيميل */}
        <div className="mt-6 text-sm text-gray-400">
            <p>للدخول الآمن: **كلمة المرور: Bismillah** | أدخل إيميلك للتحقق</p>
        </div>
      </div>

      {/* منطقة البوابة وصورة المستخدم (تأثير مرئي) */}
      <div className="mt-12 flex justify-center items-end relative z-10">
        
        {/* البوابة الرقمية */}
        <div className="w-64 h-64 relative flex justify-center items-center">
            <img 
                src="https://via.placeholder.com/300/1e40af/ffffff?text=AI+GATEWAY" // استبدل بمسار صورة البوابة
                alt="AI Gateway" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(76,29,149,0.8)]" 
            />
            
            {/* 1. الكود QR على البوابة */}
            <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-xl">
                <QrCode className="w-8 h-8 text-gray-900" /> 
            </div>

            {/* 2. بصمة الإصبع */}
            <div className="absolute bottom-1/4 left-1/4 text-yellow-400 p-2 text-3xl">
                <span role="img" aria-label="fingerprint">👍🫅</span>
            </div>

            {/* 3. صورة المستخدم في المنتصف */}
            <img 
                src="https://via.placeholder.com/60/ffffff?text=CH" // استبدل بمسار صورتك
                alt="Cherrak Houari" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-yellow-400 shadow-lg"
            />
        </div>
      </div>
    </header>
  );
};

export default Hero;
