"use client";

import { Admin } from "@/components/admin";
import { ListGuesser } from "@/components/list-guesser";
import { Resource } from "ra-core";
import { Layout } from "@/components/layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { 
  Users, 
  GraduationCap, 
  BookOpen,
  CreditCard,
  Settings
} from "lucide-react";

// Import resource components
import { StudentList } from "./resources/students/StudentList";
import { StudentEdit } from "./resources/students/StudentEdit";
import { StudentCreate } from "./resources/students/StudentCreate";
import { StudentShow } from "./resources/students/StudentShow";

import { InstructorList } from "./resources/instructors/InstructorList";
import { InstructorEdit } from "./resources/instructors/InstructorEdit";
import { InstructorCreate } from "./resources/instructors/InstructorCreate";
import { InstructorShow } from "./resources/instructors/InstructorShow";

import { LessonList } from "./resources/lessons/LessonList";
import { LessonEdit } from "./resources/lessons/LessonEdit";
import { LessonCreate } from "./resources/lessons/LessonCreate";
import { LessonShow } from "./resources/lessons/LessonShow";

export default function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      layout={Layout}
      title="BORA Admin"
    >
      <Resource
        name="students"
        list={StudentList}
        edit={StudentEdit}
        create={StudentCreate}
        show={StudentShow}
        icon={Users}
        options={{ label: "Alunos" }}
      />
      <Resource
        name="instructors"
        list={InstructorList}
        edit={InstructorEdit}
        create={InstructorCreate}
        show={InstructorShow}
        icon={GraduationCap}
        options={{ label: "Instrutores" }}
      />
      <Resource
        name="lessons"
        list={LessonList}
        edit={LessonEdit}
        create={LessonCreate}
        show={LessonShow}
        icon={BookOpen}
        options={{ label: "Aulas" }}
      />
      <Resource
        name="payments"
        list={ListGuesser}
        icon={CreditCard}
        options={{ label: "Pagamentos" }}
      />
    </Admin>
  );
}

