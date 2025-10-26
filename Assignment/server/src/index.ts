// ...existing code...
import express from 'express';
import cors from 'cors';
// ...existing code...
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// add this test route
app.get('/api/courses', (_req, res) => {
  res.json([{ id: 1, name: 'test course' }]);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});