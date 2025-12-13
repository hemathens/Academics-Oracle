import { useState, useEffect } from 'react';
import { Course } from '@/types/course';
import { courseColors } from '@/data/mockCourses';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { AddCourseDialog } from '@/components/dashboard/AddCourseDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import {
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COURSES_STORAGE_KEY = 'course_tracker_courses';

export default function Dashboard() {
  const { user, isTeacher } = useUser();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSemester, setFilterSemester] = useState<string>('all');

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  // Calculate statistics based on role
  const totalClasses = courses.reduce((acc, c) => acc + c.totalClasses, 0);
  const attendedClasses = courses.reduce((acc, c) => acc + c.attendedClasses, 0);
  const overallPercentage = totalClasses > 0
    ? Math.round((attendedClasses / totalClasses) * 100)
    : 0;
  const coursesAbove75 = courses.filter(
    (c) => c.totalClasses > 0 && (c.attendedClasses / c.totalClasses) * 100 >= 75
  ).length;

  // Teacher-specific stats
  const totalStudents = courses.reduce((acc, course) => {
    return acc + (course.enrolledStudents?.length || 0);
  }, 0);
  const totalEnrolledStudents = totalStudents;
  const averageAttendance = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => {
        if (c.totalClasses === 0) return acc;
        const percentage = (c.attendedClasses / c.totalClasses) * 100;
        return acc + percentage;
      }, 0) / courses.length)
    : 0;

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || course.type === filterType;
    const matchesSemester =
      filterSemester === 'all' || course.semester === filterSemester;
    return matchesSearch && matchesType && matchesSemester;
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher
              ? 'Manage your courses and track student attendance'
              : 'Track your attendance and stay on top of your courses'}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {isTeacher ? 'Add Course' : 'Enroll in Course'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isTeacher ? (
          <>
            <StatsCard
              title="Total Courses"
              value={courses.length}
              subtitle="Courses you teach"
              icon={BookOpen}
              iconClassName="bg-primary/10"
            />
            <StatsCard
              title="Total Students"
              value={totalStudents}
              subtitle="Across all courses"
              icon={Users}
              iconClassName="bg-accent/10"
            />
            <StatsCard
              title="Average Attendance"
              value={`${averageAttendance}%`}
              subtitle="Across all courses"
              icon={TrendingUp}
              trend={averageAttendance >= 75 ? 'up' : 'down'}
              trendValue={averageAttendance >= 75 ? 'Good' : 'Needs attention'}
              iconClassName="bg-success/10"
            />
            <StatsCard
              title="Enrolled Students"
              value={totalEnrolledStudents}
              subtitle="Total enrollments"
              icon={GraduationCap}
              iconClassName="bg-primary/10"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Courses"
              value={courses.length}
              subtitle="Active this semester"
              icon={BookOpen}
              iconClassName="bg-primary/10"
            />
            <StatsCard
              title="Overall Attendance"
              value={`${overallPercentage}%`}
              subtitle={`${attendedClasses}/${totalClasses} classes`}
              icon={TrendingUp}
              trend={overallPercentage >= 75 ? 'up' : 'down'}
              trendValue={overallPercentage >= 75 ? 'On track' : 'Needs attention'}
              iconClassName="bg-success/10"
            />
            <StatsCard
              title="This Week"
              value="12"
              subtitle="Classes attended"
              icon={Calendar}
              iconClassName="bg-accent/10"
            />
            <StatsCard
              title="Above 75%"
              value={coursesAbove75}
              subtitle={`of ${courses.length} courses`}
              icon={Award}
              iconClassName="bg-primary/10"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="theory">Theory</SelectItem>
              <SelectItem value="practical">Practical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSemester} onValueChange={setFilterSemester}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={isTeacher ? handleEditCourse : undefined}
            onDelete={isTeacher ? handleDeleteCourse : undefined}
            index={index}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-foreground">No courses found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {courses.length === 0
              ? isTeacher
                ? 'Add your first course to start teaching'
                : 'No courses enrolled yet'
              : 'Try adjusting your search or filters'}
          </p>
          {courses.length === 0 && isTeacher && (
            <Button onClick={() => setDialogOpen(true)} className="mt-4">
              Add Course
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddCourseDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingCourse(null);
        }}
        onSave={handleAddCourse}
        editingCourse={editingCourse}
      />
    </div>
  );
}
