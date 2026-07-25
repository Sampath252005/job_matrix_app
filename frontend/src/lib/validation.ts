export type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; message: string };

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export interface JobPayload {
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number;
  experience: string;
}

export function validateJob(input: Record<string, unknown>): ValidationResult<JobPayload> {
  const title = clean(input.title);
  const description = clean(input.description);
  const location = clean(input.location);
  const type = clean(input.type);
  const experience = clean(input.experience);
  const salary = Number(input.salary);

  if (!title) return { valid: false, message: "Job title is required" };
  if (title.length > 100) return { valid: false, message: "Job title cannot exceed 100 characters" };
  if (!location) return { valid: false, message: "Location is required" };
  if (location.length > 100) return { valid: false, message: "Location cannot exceed 100 characters" };
  if (!description) return { valid: false, message: "Description is required" };
  if (description.length < 20) return { valid: false, message: "Description must contain at least 20 characters" };
  if (!["Full-time", "Part-time", "Remote", "Internship"].includes(type)) {
    return { valid: false, message: "Select a valid job type" };
  }
  if (!Number.isFinite(salary) || salary < 0) {
    return { valid: false, message: "Salary must be a valid non-negative number" };
  }

  return { valid: true, data: { title, description, location, type, salary, experience } };
}

export function validateAssessment(input: {
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  startTime?: string;
  endTime?: string;
}): ValidationResult<typeof input> {
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title) return { valid: false, message: "Assessment title is required" };
  if (title.length > 100) return { valid: false, message: "Assessment title cannot exceed 100 characters" };
  if (!Number.isInteger(input.durationMinutes) || input.durationMinutes < 1 || input.durationMinutes > 480) {
    return { valid: false, message: "Duration must be between 1 and 480 minutes" };
  }
  if (!Number.isFinite(input.passingScore) || input.passingScore < 1 || input.passingScore > 100) {
    return { valid: false, message: "Passing score must be between 1 and 100" };
  }
  if (input.startTime && input.endTime && new Date(input.endTime) <= new Date(input.startTime)) {
    return { valid: false, message: "End time must be after start time" };
  }
  return { valid: true, data: { ...input, title, description } };
}

export interface QuestionPayload {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  marks: number;
  difficulty: string;
  category?: string;
}

export function validateQuestion(input: QuestionPayload): ValidationResult<QuestionPayload> {
  const fields = ["question", "option_a", "option_b", "option_c", "option_d"] as const;
  const data: QuestionPayload = { ...input };
  for (const field of fields) {
    const value = clean(input[field]);
    if (!value) return { valid: false, message: `${field === "question" ? "Question" : field.replace("_", " ").toUpperCase()} is required` };
    data[field] = value;
  }
  if (!["A", "B", "C", "D"].includes(String(input.correct_answer))) {
    return { valid: false, message: "Correct answer must be A, B, C, or D" };
  }
  const marks = Number(input.marks);
  if (!Number.isInteger(marks) || marks < 1 || marks > 100) {
    return { valid: false, message: "Marks must be a whole number between 1 and 100" };
  }
  data.marks = marks;
  return { valid: true, data };
}

export function isHttpUrl(value: string) {
  if (!value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
