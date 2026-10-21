const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');
const { apiSuccess } = require('../utils/apiResponse');

// GET /api/v1/skills  (public)
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, displayOrder: 1 });
  return apiSuccess(res, skills);
});

// POST /api/v1/admin/skills  (admin)
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  return apiSuccess(res, skill, 'Skill created', 201);
});

// PUT /api/v1/admin/skills/:id  (admin)
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
  return apiSuccess(res, skill, 'Skill updated');
});

// DELETE /api/v1/admin/skills/:id  (admin)
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
  return apiSuccess(res, null, 'Skill deleted');
});

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
