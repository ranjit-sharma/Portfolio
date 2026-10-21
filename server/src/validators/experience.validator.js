const { z } = require('zod');

const experienceSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(150),
  role: z.string().trim().min(1, 'Role is required').max(150),
  employmentType: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']).default('Internship'),
  location: z.string().optional().default(''),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable().or(z.literal('')),
  current: z.boolean().optional().default(false),
  description: z.string().optional().default(''),
  responsibilities: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  displayOrder: z.coerce.number().optional().default(0),
});

module.exports = { experienceSchema };
