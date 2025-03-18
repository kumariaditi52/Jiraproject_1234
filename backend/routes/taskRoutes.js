const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
