import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Apply protection middleware to all task routes
router.use(protect);

// CRUD Endpoints for /tasks
router.route('/')
    .get(getTasks)      // GET /tasks
    .post(createTask);  // POST /tasks

router.route('/:id')
    .put(updateTask)    // PUT /tasks/:id
    .delete(deleteTask); // DELETE /tasks/:id

export default router;