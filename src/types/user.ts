export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university?: string;
  department?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  semester: string;
  department: string;
  enrolledCourses: string[]; // Course IDs
}

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}

