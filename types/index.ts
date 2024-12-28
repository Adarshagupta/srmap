export interface QuestionPaper {
  id: string;
  title: string;
  branch: string;
  semester: number;
  subject: string;
  year: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: any;
}

export type Branch = 
  | "Computer Science and Engineering"
  | "Electronics and Communication Engineering"
  | "Mechanical Engineering"
  | "Civil Engineering"
  | "Electrical and Electronics Engineering";

export const BRANCHES: Branch[] = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical and Electronics Engineering",
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]; 