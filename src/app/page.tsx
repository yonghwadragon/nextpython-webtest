'use client';

import { useState } from 'react';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    alert('시작되었습니다!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          NextPython Web
        </h1>
        <p className="text-xl text-white/80 mb-12">
          Next.js와 Python을 연결하는 웹 애플리케이션
        </p>
        
        <button
          onClick={handleStart}
          className={`
            px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300
            ${isStarted 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-800'
            }
            transform hover:scale-105 active:scale-95
            shadow-lg hover:shadow-xl
          `}
        >
          {isStarted ? '✅ 시작됨' : '🚀 시작하기'}
        </button>

        {isStarted && (
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-white">
              🎉 성공적으로 시작되었습니다!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
