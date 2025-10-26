import { Router } from 'express';

const router = Router();

// 模擬課程數據
let courses = [
    { id: 1, title: 'Python 程式設計', description: '學習 Python 的基礎知識' },
    { id: 2, title: 'JavaScript 開發', description: '深入了解 JavaScript 語言' },
    { id: 3, title: '資料科學與分析', description: '掌握資料分析技能' }
];

// 獲取所有課程
router.get('/courses', (req, res) => {
    res.json(courses);
});

// 獲取單個課程
router.get('/courses/:id', (req, res) => {
    const { id } = req.params;
    const course = courses.find(c => c.id === parseInt(id));
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ message: '課程未找到' });
    }
});

// 創建新課程
router.post('/courses', (req, res) => {
    const newCourse = req.body;
    newCourse.id = courses.length + 1; // 設定新課程的 ID
    courses.push(newCourse);
    res.status(201).json(newCourse);
});

// 更新課程
router.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const index = courses.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        courses[index] = { id: parseInt(id), ...req.body };
        res.json(courses[index]);
    } else {
        res.status(404).json({ message: '課程未找到' });
    }
});

// 刪除課程
router.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    courses = courses.filter(c => c.id !== parseInt(id));
    res.status(204).send();
});

export { router as coursesRouter };