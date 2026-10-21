const { z } = require('zod');

const profileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  headline: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  leetcodeUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  available: z.boolean().optional(),
  availabilityNote: z.string().optional(),
  views: z.number().optional(),
});

module.exports = { profileSchema };
