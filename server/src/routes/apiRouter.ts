import { Router } from "express";
import { handleSTT } from "../controllers/sttController";

const router = Router();

// POST /api/stt 경로와 컨트롤러 연결
router.post("/stt", handleSTT);

export default router;