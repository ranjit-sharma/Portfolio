const { z } = require('zod');

const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100),
  category: z.enum(['Frontend', 'Backend', 'Database', 'Language', 'CS Fundamentals', 'Tools']),
  icon: z.string().optional().default(''),
  displayOrder: z.coerce.number().optional().default(0),
});

module.exports = { skillSchema };
