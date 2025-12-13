import { useState, useEffect } from 'react';
import { Course, CourseType, Semester } from '@/types/course';
import { courseColors } from '@/data/mockCourses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Omit<Course, 'id'>) => void;
  editingCourse?: Course | null;
}

const semesters: Semester[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function AddCourseDialog({
  open,
  onOpenChange,
  onSave,
  editingCourse,
}: AddCourseDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    faculty: '',
    semester: '1' as Semester,
    type: 'theory' as CourseType,
    totalClasses: 40,
    attendedClasses: 0,
    color: courseColors[0],
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name,
        code: editingCourse.code,
        faculty: editingCourse.faculty,
        semester: editingCourse.semester,
        type: editingCourse.type,
        totalClasses: editingCourse.totalClasses,
        attendedClasses: editingCourse.attendedClasses,
        color: editingCourse.color,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        faculty: '',
        semester: '1',
        type: 'theory',
        totalClasses: 40,
        attendedClasses: 0,
        color: courseColors[Math.floor(Math.random() * courseColors.length)],
      });
    }
  }, [editingCourse, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? 'Update the course details below.'
                : 'Fill in the details to add a new course.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                placeholder="e.g., Data Structures"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., CS201"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input
                  id="faculty"
                  placeholder="e.g., Dr. Smith"
                  value={formData.faculty}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value: Semester) =>
                    setFormData({ ...formData, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: CourseType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="practical">Practical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalClasses">Total Classes</Label>
                <Input
                  id="totalClasses"
                  type="number"
                  min="1"
                  value={formData.totalClasses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalClasses: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attendedClasses">Attended Classes</Label>
                <Input
                  id="attendedClasses"
                  type="number"
                  min="0"
                  max={formData.totalClasses}
                  value={formData.attendedClasses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendedClasses: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {courseColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      'h-8 w-8 rounded-full transition-all duration-200 hover:scale-110',
                      formData.color === color &&
                        'ring-2 ring-offset-2 ring-foreground'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCourse ? 'Save Changes' : 'Add Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
