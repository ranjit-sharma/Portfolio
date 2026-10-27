const { z } = require('zod');

const profileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  headline: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  email: z.string().email().or(z.literal('')).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  languages: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  leetcodeUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  available: z.boolean().optional(),
  availabilityNote: z.string().optional(),
  views: z.number().optional(),
  educationCgpa: z.union([z.string(), z.number()]).optional().nullable(),
  educationCurrentSemester: z.coerce.number().optional(),
  educationTotalSemesters: z.coerce.number().optional(),
  educationDegree: z.string().optional(),
  educationInstitution: z.string().optional(),
  educationStartYear: z.coerce.number().optional(),
  educationEndYear: z.coerce.number().optional(),
  educationSchools: z
    .array(
      z.object({
        institution: z.string().optional().default(''),
        qualification: z.string().optional().default(''),
        level: z.string().optional().default(''),
        board: z.string().optional().default(''),
        location: z.string().optional().default(''),
        start: z.union([z.string(), z.number()]).optional().default(''),
        end: z.union([z.string(), z.number()]).optional().default(''),
      })
    )
    .optional(),
  aboutHighlights: z
    .array(
      z.object({
        title: z.string().optional().default(''),
        desc: z.string().optional().default(''),
      })
    )
    .optional(),
});

module.exports = { profileSchema };
