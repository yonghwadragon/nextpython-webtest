'use client';

import { useState } from 'react';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleStart = async () => {
    setIsLoading(true);
    setMessage('네이버 브라우저를 실행 중...');
    
    try {
      // Python 스크립트 실행 API 호출
      const response = await fetch('/api/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start_naver' }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsStarted(true);
        setMessage('✅ 네이버 브라우저가 실행되었습니다! 수동으로 로그인해 주세요.');
      } else {
        setMessage(`❌ 오류 발생: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ 서버 연결 오류가 발생했습니다.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          className={`
            px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : isStarted 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-800'
            }
            transform hover:scale-105 active:scale-95
            shadow-lg hover:shadow-xl
            disabled:transform-none disabled:hover:scale-100
          `}
        >
          {isLoading ? '⏳ 실행 중...' : isStarted ? '✅ 실행됨' : '🚀 네이버 실행'}
        </button>

        {(message || isStarted) && (
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg max-w-md mx-auto">
            <p className="text-white text-center">
              {message || '🎉 성공적으로 시작되었습니다!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
