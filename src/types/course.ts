export type CourseType = 'theory' | 'practical';

export type Semester = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export interface Course {
  id: string;
  name: string;
  code: string;
  faculty: string;
  semester: Semester;
  type: CourseType;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  enrolledStudents?: string[]; // Student IDs - for teacher view
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent';
}
