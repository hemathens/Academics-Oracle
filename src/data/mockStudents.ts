import { Student } from '@/types/user';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    studentId: 'STU001',
    semester: '3',
    department: 'Computer Science',
    enrolledCourses: ['1', '2'],
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    studentId: 'STU002',
    semester: '3',
    department: 'Computer Science',
    enrolledCourses: ['1', '2'],
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    studentId: 'STU003',
    semester: '5',
    department: 'Computer Science',
    enrolledCourses: ['3', '4', '5'],
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    studentId: 'STU004',
    semester: '5',
    department: 'Computer Science',
    enrolledCourses: ['3', '4'],
  },
  {
    id: '5',
    name: 'Eve Davis',
    email: 'eve@example.com',
    studentId: 'STU005',
    semester: '3',
    department: 'Computer Science',
    enrolledCourses: ['1'],
  },
];

