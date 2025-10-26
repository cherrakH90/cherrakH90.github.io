import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    // الخلفية الرئيسية الداكنة
    <div className="min-h-screen bg-gray-950">
      
      {/* 1. شريط التنقل (ثابت في الأعلى) */}
      <Navbar />
      
      {/* 2. الواجهة الرئيسية (Hero Section) */}
      <Hero />
      
      {/* 3. هنا ستبدأ أقسامك الأخرى - مثال: المكتبة */}
      <section id="library" className="min-h-screen p-16 bg-gray-900 text-white flex justify-center items-center">
        <h2 className="text-4xl font-bold text-center border-b border-purple-500 pb-3">
          الخطوة التالية: تصميم عرض المكتبة الشاملة والخدمات
        </h2>
      </section>
      
      {/* هنا يمكنك إضافة قسم المغناطيس الرقمي والمواقع العالمية */}
      
    </div>
  );
}

export default App;
