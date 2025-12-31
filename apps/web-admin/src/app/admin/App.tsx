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
  Settings,
  AlertTriangle,
  Car,
  Star,
  Package,
  UserPlus,
  Target,
  MessageSquare
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
import { EmergencyList } from "./resources/emergencies/EmergencyList";
import { EmergencyShow } from "./resources/emergencies/EmergencyShow";

import { VehicleList } from "./resources/vehicles/VehicleList";
import { VehicleShow } from "./resources/vehicles/VehicleShow";
import { VehicleEdit } from "./resources/vehicles/VehicleEdit";

import { RatingList } from "./resources/ratings/RatingList";
import { RatingShow } from "./resources/ratings/RatingShow";

import { BundleList } from "./resources/bundles/BundleList";
import { BundleShow } from "./resources/bundles/BundleShow";
import { BundleEdit } from "./resources/bundles/BundleEdit";
import { BundleCreate } from "./resources/bundles/BundleCreate";

import { ReferralList } from "./resources/referrals/ReferralList";
import { ReferralShow } from "./resources/referrals/ReferralShow";

import { SkillList } from "./resources/skills/SkillList";
import { SkillShow } from "./resources/skills/SkillShow";
import { SkillEdit } from "./resources/skills/SkillEdit";
import { SkillCreate } from "./resources/skills/SkillCreate";

import { ChatMessageList } from "./resources/chatMessages/ChatMessageList";
import { ChatMessageShow } from "./resources/chatMessages/ChatMessageShow";

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
      <Resource
        name="emergencies"
        list={EmergencyList}
        show={EmergencyShow}
        icon={AlertTriangle}
        options={{ label: "Emergências (SOS)" }}
      />
      <Resource
        name="vehicles"
        list={VehicleList}
        show={VehicleShow}
        edit={VehicleEdit}
        icon={Car}
        options={{ label: "Veículos" }}
      />
      <Resource
        name="ratings"
        list={RatingList}
        show={RatingShow}
        icon={Star}
        options={{ label: "Avaliações" }}
      />
      <Resource
        name="bundles"
        list={BundleList}
        show={BundleShow}
        edit={BundleEdit}
        create={BundleCreate}
        icon={Package}
        options={{ label: "Pacotes de Aulas" }}
      />
      <Resource
        name="referrals"
        list={ReferralList}
        show={ReferralShow}
        icon={UserPlus}
        options={{ label: "Indicações" }}
      />
      <Resource
        name="skills"
        list={SkillList}
        show={SkillShow}
        edit={SkillEdit}
        create={SkillCreate}
        icon={Target}
        options={{ label: "Habilidades" }}
      />
      <Resource
        name="chatMessages"
        list={ChatMessageList}
        show={ChatMessageShow}
        icon={MessageSquare}
        options={{ label: "Mensagens" }}
      />
    </Admin>
  );
}

