import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, generateTasksFromText } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();


router.use(protect);


router.route('/')
    .get(getTasks)
    .post(createTask);


router.post('/generate', generateTasksFromText);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

export default router;