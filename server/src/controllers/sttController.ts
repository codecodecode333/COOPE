import { Request, Response } from "express";
import { File } from 'buffer';
import { openai } from "../config/openaiConfig";

export const handleSTT = async (req: Request, res: Response) => {
    try {
        const { audioContent } = req.body;

        // Validate audioContent before attempting to split or decode it
        if (typeof audioContent !== 'string' || !audioContent.includes(',')) {
            return res.status(400).json({ error: '잘못된 오디오 데이터 형식입니다.' });
        }

        const parts = audioContent.split(',');
        const base64Audio = parts[1];

        if (!base64Audio) {
            return res.status(400).json({ error: '오디오 데이터가 비어 있습니다.' });
        }
        const audioBuffer = Buffer.from(base64Audio, 'base64');
        const file = new File([audioBuffer], 'audio.webm', { type: 'audio/webm; codecs=opus' });

        const response = await openai.audio.transcriptions.create({
            file,
            model: "whisper-1",
            language: "ko",
            response_format: "text"
        });

        res.json({ transcript: response.toString() });
    } catch (err) {
        res.status(500).json({ error: 'STT 변환 실패' });
    }
};