import { NextRequest, NextResponse } from "next/server";
import { SpeechClient, protos } from "@google-cloud/speech";

export async function POST(req: NextRequest) {
  try {
    const { audioContent } = await req.json();
    
    if (!audioContent) {
      return NextResponse.json({ error: "오디오 데이터가 없습니다." }, { status: 400 });
    }

    const client = new SpeechClient();

    // base64 데이터에서 실제 오디오 데이터만 추출
    const base64Audio = audioContent.replace(/^data:audio\/\w+;codecs=opus;base64,/, '');
    
    const audio = { content: base64Audio };
    const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
      encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
      sampleRateHertz: 48000,
      languageCode: "ko-KR",
      model: "default",
      useEnhanced: true,
      enableAutomaticPunctuation: true
    };
    
    const request: protos.google.cloud.speech.v1.IRecognizeRequest = { audio, config };

    const [response] = await client.recognize(request);
    const results = response.results as protos.google.cloud.speech.v1.SpeechRecognitionResult[];
    
    if (!results || results.length === 0) {
      return NextResponse.json({ error: "음성 인식 결과가 없습니다." }, { status: 400 });
    }

    // 음성 인식 결과를 그대로 반환
    let transcript = results
      .map((r) => r.alternatives?.[0]?.transcript || "")
      .filter(text => text.trim() !== "")
      .join(" ");

    // 후보정: 연속 공백 제거, 불필요한 추임새(음, 어, 저기 등) 제거
    transcript = transcript
      .replace(/(음|어|저기|아)[,\.\s]/g, ' ') // 추임새 제거(간단 예시)
      .replace(/\s{2,}/g, ' ') // 연속 공백 제거
      .trim();

    if (!transcript || transcript.trim() === "") {
      return NextResponse.json({ error: "음성 인식 결과가 없습니다." }, { status: 400 });
    }

    return NextResponse.json({ transcript });
  } catch (err: any) {
    console.error("STT 처리 중 오류:", err);
    return NextResponse.json(
      { error: err.message || "STT 변환 실패" },
      { status: 500 }
    );
  }
} 