import { NextRequest, NextResponse } from 'next/server';

const RENDER_API_URL = "https://naver-automation-api.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action !== 'start_naver') {
      return NextResponse.json(
        { error: '지원하지 않는 액션입니다.' },
        { status: 400 }
      );
    }

    console.log('Calling Render API...');
    
    // Render 서버의 API 호출
    const response = await fetch(`${RENDER_API_URL}/api/run-naver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 'web_user',
        action: action
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({
        success: data.success,
        message: data.message || '네이버 자동화 서버에서 처리 중입니다.',
        server: 'Render',
        output: data.output
      });
    } else {
      return NextResponse.json(
        { 
          error: data.message || 'Render 서버에서 오류가 발생했습니다.',
          details: data.error
        },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Render API 호출 오류:', error);
    
    // Render 서버가 슬립 모드일 가능성
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Render 서버가 슬립 모드입니다. 30초 후 다시 시도해주세요.',
          details: '무료 서버는 15분 비활성화 후 슬립 상태가 됩니다.',
          retry: true
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Render 서버 연결 실패',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}