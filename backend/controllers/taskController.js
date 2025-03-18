const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

  if (!title || !description || !project) {
    res.status(400);
    throw new Error('Please add title, description and project');
  }

  // Check if project exists and user has access
  const projectExists = await Project.findById(project);
  
  if (!projectExists) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or member of the project
  if (
    projectExists.owner.toString() !== req.user._id.toString() &&
    !projectExists.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error('Not authorized to create tasks in this project');
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    project,
    assignedTo,
    createdBy: req.user._id,
  });

  res.status(201).json(task);
});

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  
  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user._id.toString() &&
    !project.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error('Not authorized to view tasks in this project');
  }

  const tasks = await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  res.json(tasks);
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project);
  
  if (
    project.owner.toString() !== req.user._id.toString() &&
    !project.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error('Not authorized to view this task');
  }

  res.json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project);
  
  if (
    project.owner.toString() !== req.user._id.toString() &&
    !project.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('assignedTo', 'name email');

  res.json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the project
  const project = await Project.findById(task.project);
  
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.remove();

  res.json({ message: 'Task removed' });
});

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};
