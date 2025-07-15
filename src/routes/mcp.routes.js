import express from 'express';
import { handleMcp } from '../controllers/mcp.controller.js';

const router = express.Router();

router.post('/', handleMcp);

export default router;
