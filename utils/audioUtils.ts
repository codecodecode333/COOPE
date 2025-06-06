import fs from 'fs';
import path from 'path';

export const saveBase64Audio = async (base64Audio: string, outputPath: string): Promise<string> => {
  try {
    // base64 문자열에서 실제 데이터 부분만 추출 (필요한 경우)
    const base64Data = base64Audio.replace(/^data:audio\/\w+;base64,/, '');
    
    // base64를 디코딩
    const audioBuffer = Buffer.from(base64Data, 'base64');
    
    // 파일로 저장
    await fs.promises.writeFile(outputPath, audioBuffer);
    
    return outputPath;
  } catch (error) {
    console.error('오디오 저장 중 오류 발생:', error);
    throw error;
  }
};

export const base64ToAudioBuffer = (base64Audio: string): Buffer => {
  try {
    const base64Data = base64Audio.replace(/^data:audio\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  } catch (error) {
    console.error('base64 디코딩 중 오류 발생:', error);
    throw error;
  }
}; 