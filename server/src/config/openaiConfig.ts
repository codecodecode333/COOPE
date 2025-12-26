import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error(
        "OpenAI API key가 없습니다. OPENAI_API_KEY를 환경변수에 세팅해주세요!" +
        " .env.local file 이나 deployment configuration를 확인해보기"
    );
}

export const openai = new OpenAI({
    apiKey,
});

