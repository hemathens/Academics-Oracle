import { useState, useEffect } from 'react';
import { Course } from '@/types/course';
import { AddCourseDialog } from '@/components/dashboard/AddCourseDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  FlaskConical,
  ArrowUpDown,
  Users,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { CourseStudentsDialog } from '@/components/courses/CourseStudentsDialog';

const COURSES_STORAGE_KEY = 'course_tracker_courses';

export default function Courses() {
  const { isTeacher } = useUser();
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(COURSES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sortBy, setSortBy] = useState<keyof Course | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const handleSort = (key: keyof Course) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleAddCourse = (courseData: Omit<Course, 'id'>) => {
    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id ? { ...courseData, id: c.id } : c
        )
      );
    } else {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
      };
      setCourses([...courses, newCourse]);
    }
    setEditingCourse(null);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setDialogOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const getAttendancePercentage = (course: Course) => {
    if (course.totalClasses === 0) return 0;
    return Math.round((course.attendedClasses / course.totalClasses) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher
              ? 'Manage your courses and view student enrollments'
              : 'Manage all your courses and track attendance'}
          </p>
        </div>
        {isTeacher && (
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="gap-1 -ml-4"
                >
                  Course
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('code')}
                  className="gap-1 -ml-4"
                >
                  Code
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('semester')}
                  className="gap-1 -ml-4"
                >
                  Semester
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              {isTeacher && <TableHead>Enrolled Students</TableHead>}
              {!isTeacher && <TableHead>Attendance</TableHead>}
              {isTeacher && <TableHead className="w-[100px]">Actions</TableHead>}
              {!isTeacher && <TableHead className="w-[100px]">View</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCourses.map((course) => {
              const percentage = getAttendancePercentage(course);
              return (
                <TableRow key={course.id} className="group">
                  <TableCell>
                    <div
                      className="h-8 w-2 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.code}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {course.faculty}
                  </TableCell>
                  <TableCell>Sem {course.semester}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {course.type === 'theory' ? (
                        <BookOpen className="h-3 w-3" />
                      ) : (
                        <FlaskConical className="h-3 w-3" />
                      )}
                      {course.type === 'theory' ? 'Theory' : 'Practical'}
                    </Badge>
                  </TableCell>
                  {isTeacher ? (
                    <>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {course.enrolledStudents?.length || 0} students
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedCourse(course);
                              setStudentsDialogOpen(true);
                            }}
                            title="View Students"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={percentage}
                            className="h-2 w-20"
                            style={
                              {
                                '--progress-background': course.color,
                              } as React.CSSProperties
                            }
                          />
                          <span
                            className={cn(
                              'text-sm font-medium',
                              percentage >= 75 ? 'text-success' : 'text-destructive'
                            )}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedCourse(course);
                            setStudentsDialogOpen(true);
                          }}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-foreground">No courses yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isTeacher
              ? 'Add your first course to start teaching'
              : 'No courses enrolled yet'}
          </p>
          {isTeacher && (
            <Button onClick={() => setDialogOpen(true)} className="mt-4">
              Add Course
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Dialog - Only for teachers */}
      {isTeacher && (
        <AddCourseDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingCourse(null);
          }}
          onSave={handleAddCourse}
          editingCourse={editingCourse}
        />
      )}

      {/* Course Students Dialog */}
      {selectedCourse && (
        <CourseStudentsDialog
          open={studentsDialogOpen}
          onOpenChange={setStudentsDialogOpen}
          course={selectedCourse}
        />
      )}
    </div>
  );
}
