const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');
const slugify = require('../utils/slugify');
const { deleteAsset } = require('../config/cloudinary');

// GET /api/v1/projects  (public)
const getProjects = asyncHandler(async (req, res) => {
  const filter = { status: 'active' };
  const projects = await Project.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  return apiSuccess(res, projects);
});

// GET /api/v1/projects/:slug  (public)
const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, status: 'active' });
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  return apiSuccess(res, project);
});

// GET /api/v1/admin/projects  (admin)
const getAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find().sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(),
  ]);
  return apiSuccess(res, { projects, total, page, pages: Math.ceil(total / limit) });
});

// POST /api/v1/admin/projects  (admin)
const createProject = asyncHandler(async (req, res) => {
  const slug = slugify(req.body.title);
  const existing = await Project.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const project = await Project.create({ ...req.body, slug: finalSlug });
  return apiSuccess(res, project, 'Project created', 201);
});

// PUT /api/v1/admin/projects/:id  (admin)
const updateProject = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const existing = await Project.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Project not found' });

  // If image was changed or removed, delete the old image from Cloudinary
  if (req.body.image !== undefined && req.body.image !== existing.image && existing.image) {
    deleteAsset(existing.image).catch(() => {});
  }

  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return apiSuccess(res, project, 'Project updated');
});

// DELETE /api/v1/admin/projects/:id  (admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  // Delete image from Cloudinary/storage
  if (project.image) {
    deleteAsset(project.image).catch(() => {});
  }

  return apiSuccess(res, null, 'Project deleted');
});

module.exports = { getProjects, getProjectBySlug, getAllProjects, createProject, updateProject, deleteProject };
