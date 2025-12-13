import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/course';
import { BookOpen, FlaskConical, Clock } from 'lucide-react';

const COURSES_STORAGE_KEY = 'course_tracker_courses';

interface ScheduleItem {
  course: Course;
  time: string;
  duration: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
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

  // Load courses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(COURSES_STORAGE_KEY);
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch {
        setCourses([]);
      }
    }
  }, []);

  // Mock schedule for selected date (in a real app, this would come from a schedule API)
  const todaySchedule: ScheduleItem[] = courses.slice(0, 3).map((course, index) => ({
    course,
    time: ['09:00 AM', '11:00 AM', '02:00 PM'][index] || '09:00 AM',
    duration: course.type === 'practical' ? '2h' : '1h',
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          View your class schedule and attendance history
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Calendar */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        {/* Schedule for selected date */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>
              {date?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardTitle>
            <CardDescription>
              {todaySchedule.length} classes scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-all hover:shadow-soft animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="mt-1 h-10 w-1 rounded-full"
                    style={{ backgroundColor: item.course.color }}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {item.course.name}
                      </h4>
                      <Badge variant="secondary">{item.course.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.course.faculty}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {item.time} ({item.duration})
                      </div>
                      <Badge variant="outline" className="gap-1">
                        {item.course.type === 'theory' ? (
                          <BookOpen className="h-3 w-3" />
                        ) : (
                          <FlaskConical className="h-3 w-3" />
                        )}
                        {item.course.type === 'theory' ? 'Theory' : 'Practical'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {todaySchedule.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {courses.length === 0
                      ? 'No courses enrolled yet. Add courses to see your schedule.'
                      : 'No classes scheduled for this day'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
