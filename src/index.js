import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mcpRoutes from './routes/mcp.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());  

app.use('/mcp', mcpRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor MCP escuchando en http://localhost:${PORT}`);
});
