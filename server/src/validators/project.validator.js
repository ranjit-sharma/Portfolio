const { z } = require('zod');

const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  categoryText: z.string().optional().default(''),
  shortDescription: z.string().trim().min(1, 'Short description is required').max(500),
  fullDescription: z.string().optional().default(''),
  technologies: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(''),
  gallery: z.array(z.string()).optional().default([]),
  githubUrl: z.string().optional().default(''),
  liveDemoUrl: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  displayOrder: z.coerce.number().optional().default(0),
  status: z.enum(['active', 'draft', 'archived']).optional().default('active'),
});

module.exports = { projectSchema };
