import { CoursesGet } from "@/data/courses";
import { CourseList } from "@/components/course/course_list";
import type { Prisma } from "@prisma/client";

type Course = Prisma.CourseGetPayload<{
  include: {
    startingPoint: true;
    routes: true; // orderByは型に影響しないので true でOK
    points: {
      include: {
        point: true;
      };
    };
    locations: {
      include: {
        course: true;
        place: true; // ここは null 許容される
      };
    };
  };
}>;

const Course = async () => {
  const courses: Course[] = await CoursesGet().catch(() => []);

  return (
    <div className="text-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-center">コース一覧</h1>
        <p>（全24コース中 {courses.length}コースのみ）</p>
        <p>（今後さらに追加する予定です。）</p>
      </div>
      <CourseList courses={courses}></CourseList>
    </div>
  );
};

export default Course;
