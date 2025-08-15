import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action !== 'start_naver') {
      return NextResponse.json(
        { error: '지원하지 않는 액션입니다.' },
        { status: 400 }
      );
    }

    // Python 스크립트 경로 설정
    const projectRoot = process.cwd();
    const seleniumPath = path.resolve(projectRoot, '..', 'selenium-naver');
    const pythonScript = path.join(seleniumPath, 'naver_manual_login.py');
    const venvPython = path.join(seleniumPath, 'venv', 'Scripts', 'python.exe');

    // 경로 존재 확인
    console.log('Selenium path:', seleniumPath);
    console.log('Python script path:', pythonScript);
    console.log('Venv python path:', venvPython);
    
    if (!fs.existsSync(pythonScript)) {
      return NextResponse.json(
        { error: `Python 스크립트를 찾을 수 없습니다: ${pythonScript}` },
        { status: 404 }
      );
    }
    
    if (!fs.existsSync(venvPython)) {
      return NextResponse.json(
        { error: `가상환경 Python을 찾을 수 없습니다: ${venvPython}` },
        { status: 404 }
      );
    }

    // Python 스크립트 실행
    console.log('Starting Python process...');
    const pythonProcess = spawn(venvPython, [pythonScript], {
      cwd: seleniumPath,
      detached: false, // detached를 false로 변경
      stdio: ['ignore', 'pipe', 'pipe'] // stdout, stderr 파이프로 연결
    });

    // 프로세스 출력 로깅
    pythonProcess.stdout?.on('data', (data) => {
      console.log('Python stdout:', data.toString());
    });
    
    pythonProcess.stderr?.on('data', (data) => {
      console.error('Python stderr:', data.toString());
    });
    
    pythonProcess.on('error', (error) => {
      console.error('Python process error:', error);
    });
    
    pythonProcess.on('close', (code) => {
      console.log(`Python process closed with code ${code}`);
    });

    // 짧은 대기 후 프로세스 상태 확인
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (pythonProcess.killed) {
      return NextResponse.json(
        { error: 'Python 프로세스가 예상치 못하게 종료되었습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '네이버 브라우저가 실행되었습니다.',
      pid: pythonProcess.pid,
      paths: {
        seleniumPath,
        pythonScript,
        venvPython
      }
    });

  } catch (error) {
    console.error('Python 실행 오류:', error);
    return NextResponse.json(
      { 
        error: 'Python 스크립트 실행 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}