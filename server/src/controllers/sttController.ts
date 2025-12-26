import { Request, Response } from "express";
import { File } from 'buffer';
import { openai } from "../config/openaiConfig";

export const handleSTT = async (req: Request, res: Response) => {
    try {
        const { audioContent } = req.body;
        const base64Audio = audioContent.split(',')[1];
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