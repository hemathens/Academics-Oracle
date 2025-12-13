import { useState, useEffect } from 'react';
import { Student } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  User,
  Mail,
  GraduationCap,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { AddStudentDialog } from '@/components/students/AddStudentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const STUDENTS_STORAGE_KEY = 'course_tracker_students';

export default function Students() {
  const { isTeacher } = useUser();
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
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
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Student | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Save students to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Redirect if not teacher
  if (!isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <User className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 font-semibold text-foreground">Access Denied</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This page is only available for teachers.
        </p>
      </div>
    );
  }

  const handleSort = (key: keyof Student) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query)
    );
  });

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    if (editingStudent) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id ? { ...studentData, id: s.id } : s
        )
      );
    } else {
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString(),
      };
      setStudents([...students, newStudent]);
    }
    setEditingStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      setStudents(students.filter((s) => s.id !== studentToDelete));
      setStudentToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Students
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your students and their enrollments
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students by name, email, ID, or department..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="gap-1 -ml-4"
                >
                  Name
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('studentId')}
                  className="gap-1 -ml-4"
                >
                  Student ID
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('email')}
                  className="gap-1 -ml-4"
                >
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
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
              <TableHead>Department</TableHead>
              <TableHead>Enrolled Courses</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    {student.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{student.studentId}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {student.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Sem {student.semester}</Badge>
                </TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {student.enrolledCourses.length} course
                      {student.enrolledCourses.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <User className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-foreground">
            {searchQuery ? 'No students found' : 'No students yet'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Add your first student to start managing enrollments'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setDialogOpen(true)} className="mt-4">
              Add Student
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddStudentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingStudent(null);
        }}
        onSave={handleAddStudent}
        editingStudent={editingStudent}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student and remove all their enrollment data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

