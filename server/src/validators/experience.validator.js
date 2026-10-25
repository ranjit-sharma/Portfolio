const { z } = require('zod');

const experienceSchema = z
  .object({
    company: z.string().trim().min(1, 'Company is required').max(150),
    companyShort: z.string().optional().default(''),
    companySub: z.string().optional().default(''),
    role: z.string().trim().min(1, 'Role is required').max(150),
    employmentType: z
      .enum(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'])
      .default('Internship'),
    location: z.string().optional().default(''),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional().nullable().or(z.literal('')),
    current: z.boolean().optional().default(false),
    durationText: z.string().optional().default(''),
    description: z.string().optional().default(''),
    projectTitle: z.string().optional().default(''),
    repoUrl: z.string().optional().default(''),
    repoLabel: z.string().optional().default('Database repo'),
    certificateUrl: z.string().optional().default(''),
    stats: z
      .array(
        z.object({
          value: z.string().optional().default(''),
          label: z.string().optional().default(''),
        })
      )
      .optional()
      .default([]),
    responsibilities: z.array(z.string()).optional().default([]),
    technologies: z.array(z.string()).optional().default([]),
    displayOrder: z.coerce.number().optional().default(0),
  })
  .passthrough();

module.exports = { experienceSchema };
