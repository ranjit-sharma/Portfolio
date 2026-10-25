const { z } = require('zod');

const certificationSchema = z.object({
  name: z.string().trim().min(1, 'Certification name is required').max(200),
  issuer: z.string().trim().min(1, 'Issuer is required').max(150),
  issueDate: z.string().optional().nullable().or(z.literal('')),
  credentialUrl: z.string().optional().default(''),
  image: z.string().optional().default(''),
  description: z.string().optional().default(''),
  category: z.string().optional().default('Certifications'),
  windowTitle: z.string().optional().default(''),
  badge: z.string().optional().default(''),
  dateTag: z.string().optional().default(''),
  displayOrder: z.coerce.number().optional().default(0),
});

module.exports = { certificationSchema };
