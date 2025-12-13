import { Course } from '@/types/course';
import { Student, StudentAttendance } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, Mail, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const STUDENTS_STORAGE_KEY = 'course_tracker_students';

interface CourseStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
}

export function CourseStudentsDialog({
  open,
  onOpenChange,
  course,
}: CourseStudentsDialogProps) {
  const { isTeacher } = useUser();

  // Get enrolled students from localStorage
  const allStudents: Student[] = (() => {
    const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  })();

  const enrolledStudents = allStudents.filter((student) =>
    course.enrolledStudents?.includes(student.id)
  );

  // Calculate attendance for each student (mock data)
  const studentAttendances: StudentAttendance[] = enrolledStudents.map(
    (student) => {
      // Mock attendance calculation - in real app, this would come from attendance records
      const totalClasses = course.totalClasses;
      const attendedClasses = Math.floor(
        (course.attendedClasses / course.totalClasses) * totalClasses * (0.8 + Math.random() * 0.4)
      );
      const attendancePercentage = Math.round(
        (attendedClasses / totalClasses) * 100
      );

      return {
        studentId: student.id,
        studentName: student.name,
        studentIdNumber: student.studentId,
        totalClasses,
        attendedClasses: Math.min(attendedClasses, totalClasses),
        attendancePercentage,
      };
    }
  );

  const averageAttendance =
    studentAttendances.length > 0
      ? Math.round(
          studentAttendances.reduce(
            (acc, s) => acc + s.attendancePercentage,
            0
          ) / studentAttendances.length
        )
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{course.name} - Students</DialogTitle>
          <DialogDescription>
            {isTeacher
              ? `View and manage student enrollments and attendance for ${course.code}`
              : `View enrolled students in ${course.code}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{enrolledStudents.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="text-2xl font-bold">{averageAttendance}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{course.totalClasses}</p>
            </div>
          </div>

          {/* Students Table */}
          {enrolledStudents.length > 0 ? (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendances.map((attendance) => (
                    <TableRow key={attendance.studentId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          {attendance.studentName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {attendance.studentIdNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {allStudents.find((s) => s.id === attendance.studentId)
                            ?.email || ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={attendance.attendancePercentage}
                            className="h-2 w-24"
                            style={
                              {
                                '--progress-background': course.color,
                              } as React.CSSProperties
                            }
                          />
                          <span
                            className={cn(
                              'text-sm font-medium min-w-[3rem]',
                              attendance.attendancePercentage >= 75
                                ? 'text-success'
                                : 'text-destructive'
                            )}
                          >
                            {attendance.attendancePercentage}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {attendance.attendedClasses} / {attendance.totalClasses}{' '}
                          classes
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            attendance.attendancePercentage >= 75
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {attendance.attendancePercentage >= 75
                            ? 'On Track'
                            : 'At Risk'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold text-foreground">
                No students enrolled
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isTeacher
                  ? 'Enroll students to this course to track their attendance'
                  : 'No students are currently enrolled in this course'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

