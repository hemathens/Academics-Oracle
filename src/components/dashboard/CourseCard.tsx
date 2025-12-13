import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit2, Trash2, BookOpen, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
  index: number;
}

export function CourseCard({ course, onEdit, onDelete, index }: CourseCardProps) {
  const attendancePercentage = Math.round(
    (course.attendedClasses / course.totalClasses) * 100
  );

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { label: 'Excellent', className: 'bg-success/10 text-success' };
    if (percentage >= 75) return { label: 'Good', className: 'bg-primary/10 text-primary' };
    if (percentage >= 65) return { label: 'Warning', className: 'bg-warning/10 text-warning' };
    return { label: 'Critical', className: 'bg-destructive/10 text-destructive' };
  };

  const status = getAttendanceStatus(attendancePercentage);

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-elevated animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: course.color }}
      />

      <div className="ml-3 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{course.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {course.code}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{course.faculty}</p>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(course)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            {course.type === 'theory' ? (
              <BookOpen className="h-3 w-3" />
            ) : (
              <FlaskConical className="h-3 w-3" />
            )}
            {course.type === 'theory' ? 'Theory' : 'Practical'}
          </Badge>
          <Badge variant="outline">Sem {course.semester}</Badge>
          <Badge className={cn('border-0', status.className)}>{status.label}</Badge>
        </div>

        {/* Attendance Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Attendance</span>
            <span className="font-semibold" style={{ color: course.color }}>
              {attendancePercentage}%
            </span>
          </div>
          <Progress
            value={attendancePercentage}
            className="h-2"
            style={
              {
                '--progress-background': course.color,
              } as React.CSSProperties
            }
          />
          <p className="text-xs text-muted-foreground">
            {course.attendedClasses} / {course.totalClasses} classes attended
          </p>
        </div>
      </div>
    </div>
  );
}
