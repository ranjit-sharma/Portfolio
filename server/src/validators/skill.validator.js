const { z } = require('zod');

const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100),
  category: z.string().trim().min(1, 'Category is required').max(100),
  icon: z.string().optional().default(''),
  displayOrder: z.coerce.number().optional().default(0),
});

module.exports = { skillSchema };
