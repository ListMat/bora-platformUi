import { DataProvider } from "@/components/admin";

// Simulação de dados para desenvolvimento
// Em produção, isso será conectado ao tRPC
const students = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    phone: "+55 11 98765-4321",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@example.com",
    phone: "+55 11 98765-1234",
    createdAt: new Date("2024-02-20"),
  },
];

const instructors = [
  {
    id: "1",
    name: "Carlos Oliveira",
    email: "carlos@example.com",
    phone: "+55 11 99999-8888",
    status: "APPROVED",
    createdAt: new Date("2023-12-01"),
  },
];

const lessons = [
  {
    id: "1",
    studentId: "1",
    instructorId: "1",
    scheduledAt: new Date("2024-12-10T10:00:00"),
    status: "SCHEDULED",
    address: "Rua ABC, 123",
  },
];

const payments = [
  {
    id: "1",
    lessonId: "1",
    amount: 150.0,
    method: "PIX",
    status: "COMPLETED",
    createdAt: new Date("2024-12-01"),
  },
];

const vehicles = [
  {
    id: "1",
    userId: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    color: "Branco",
    plateLastFour: "1D23",
    photoUrl: "https://via.placeholder.com/150",
    category: "SEDAN",
    transmission: "AUTOMATICO",
    fuel: "FLEX",
    engine: "2.0",
    horsePower: 140,
    hasDualPedal: true,
    pedalPhotoUrl: "https://via.placeholder.com/150",
    acceptStudentCar: false,
    safetyFeatures: ["ABS", "Air-bag duplo"],
    comfortFeatures: ["Ar-digital", "Bluetooth"],
    status: "active",
    createdAt: new Date("2024-01-10"),
    user: {
      id: "1",
      name: "Carlos Oliveira",
      email: "carlos@example.com",
      role: "INSTRUCTOR",
    },
  },
  {
    id: "2",
    userId: "2",
    brand: "Honda",
    model: "Civic",
    year: 2019,
    color: "Preto",
    plateLastFour: "2E34",
    photoUrl: "https://via.placeholder.com/150",
    category: "SEDAN",
    transmission: "MANUAL",
    fuel: "FLEX",
    engine: "1.8",
    horsePower: 130,
    hasDualPedal: false,
    pedalPhotoUrl: null,
    acceptStudentCar: false,
    safetyFeatures: ["ABS"],
    comfortFeatures: ["Ar-digital"],
    status: "active",
    createdAt: new Date("2024-02-15"),
    user: {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
      role: "STUDENT",
    },
  },
];

const ratings = [
  {
    id: "1",
    lessonId: "1",
    studentId: "1",
    instructorId: "1",
    rating: 5,
    comment: "Excelente instrutor, muito paciente e didático!",
    createdAt: new Date("2024-12-11"),
    student: {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
    },
    instructor: {
      id: "1",
      name: "Carlos Oliveira",
      email: "carlos@example.com",
    },
    lesson: {
      id: "1",
      scheduledAt: new Date("2024-12-10T10:00:00"),
      status: "FINISHED",
    },
  },
  {
    id: "2",
    lessonId: "1",
    studentId: "2",
    instructorId: "1",
    rating: 4,
    comment: "Bom instrutor, mas poderia ser mais pontual.",
    createdAt: new Date("2024-12-11"),
    student: {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
    },
    instructor: {
      id: "1",
      name: "Carlos Oliveira",
      email: "carlos@example.com",
    },
    lesson: {
      id: "1",
      scheduledAt: new Date("2024-12-10T10:00:00"),
      status: "FINISHED",
    },
  },
];

const bundles = [
  {
    id: "1",
    name: "Pacote 5 Aulas",
    description: "Pacote básico com 5 aulas",
    totalLessons: 5,
    price: 600.0,
    discount: 10,
    expiryDays: 90,
    isActive: true,
    featured: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Pacote 20 Aulas Premium",
    description: "Pacote premium com 20 aulas e desconto especial",
    totalLessons: 20,
    price: 2000.0,
    discount: 20,
    expiryDays: 180,
    isActive: true,
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const referrals = [
  {
    id: "1",
    referrerId: "1",
    referredId: "2",
    rewardAmount: 50.0,
    rewardPaid: false,
    createdAt: new Date("2024-02-01"),
    referrer: {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
    },
    referred: {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
    },
  },
];

const skills = [
  {
    id: "1",
    name: "Baliza",
    description: "Estacionamento em vaga",
    category: "INTERMEDIATE",
    weight: 2,
    order: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Controle de Embreagem",
    description: "Domínio do uso da embreagem",
    category: "BASIC",
    weight: 1,
    order: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const chatMessages = [
  {
    id: "1",
    lessonId: "1",
    senderId: "1",
    content: "Olá, estou a caminho!",
    messageType: "text",
    mediaUrl: null,
    mediaDuration: null,
    isRead: true,
    readAt: new Date("2024-12-10T09:50:00"),
    createdAt: new Date("2024-12-10T09:45:00"),
    sender: {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
    },
    lesson: {
      id: "1",
      scheduledAt: new Date("2024-12-10T10:00:00"),
    },
  },
  {
    id: "2",
    lessonId: "1",
    senderId: "1",
    content: "Foto do local",
    messageType: "image",
    mediaUrl: "https://via.placeholder.com/300",
    mediaDuration: null,
    isRead: false,
    readAt: null,
    createdAt: new Date("2024-12-10T09:55:00"),
    sender: {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
    },
    lesson: {
      id: "1",
      scheduledAt: new Date("2024-12-10T10:00:00"),
    },
  },
];

const db: Record<string, any[]> = {
  students,
  instructors,
  lessons,
  payments,
  vehicles,
  ratings,
  bundles,
  referrals,
  skills,
  chatMessages,
};

const REAL_RESOURCES = ['students', 'instructors', 'bundles'];

async function getResourceData(resource: string) {
  if (REAL_RESOURCES.includes(resource)) {
    try {
      const res = await fetch(`/api/admin/${resource}`);
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json) ? json : (json.data || []);
      }
    } catch (e) {
      console.error(`Error fetching ${resource}`, e);
    }
  }
  return db[resource] || [];
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const data = await getResourceData(resource);

    // Simple filtering
    let filteredData = [...data];
    if (params.filter) {
      Object.keys(params.filter).forEach((key) => {
        const value = params.filter[key];
        if (value !== undefined && value !== null && value !== "") {
          filteredData = filteredData.filter((item) =>
            String(item[key]).toLowerCase().includes(String(value).toLowerCase())
          );
        }
      });
    }

    // Sorting
    if (params.sort?.field) {
      filteredData.sort((a, b) => {
        const aVal = a[params.sort!.field];
        const bVal = b[params.sort!.field];
        if (params.sort!.order === "ASC") {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
    }

    // Pagination
    const { page = 1, perPage = 10 } = params.pagination || {};
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = filteredData.slice(start, end);

    return {
      data: paginatedData,
      total: filteredData.length,
    };
  },

  getOne: async (resource, params) => {
    const data = await getResourceData(resource);
    const item = data.find((item) => item.id === params.id);
    if (!item) {
      throw new Error(`Item not found: ${resource}/${params.id}`);
    }
    return { data: item };
  },

  getMany: async (resource, params) => {
    const data = await getResourceData(resource);
    const items = data.filter((item) => params.ids.includes(item.id));
    return { data: items };
  },

  getManyReference: async (resource, params) => {
    const data = await getResourceData(resource);
    const filteredData = data.filter(
      (item) => item[params.target] === params.id
    );
    return {
      data: filteredData,
      total: filteredData.length,
    };
  },

  create: async (resource, params) => {
    if (REAL_RESOURCES.includes(resource)) {
      const res = await fetch(`/api/admin/${resource}`, {
        method: 'POST',
        body: JSON.stringify(params.data)
      });
      const json = await res.json();
      if (json.error || !res.ok) throw new Error(json.error || "Failed to create");
      const newItem = json.data || json;
      return { data: newItem };
    }

    const data = db[resource] || [];
    const newItem = {
      ...params.data,
      id: String(data.length + 1),
      createdAt: new Date(),
    };
    data.push(newItem);
    return { data: newItem };
  },

  update: async (resource, params) => {
    const data = db[resource] || [];
    const index = data.findIndex((item) => item.id === params.id);
    if (index === -1) {
      // Se nao achar no mock, finge sucesso para API real (ja que nao temos endpoint update)
      if (REAL_RESOURCES.includes(resource)) return { data: params.data as any };
      throw new Error(`Item not found: ${resource}/${params.id}`);
    }
    const updatedItem = { ...data[index], ...params.data };
    data[index] = updatedItem;
    return { data: updatedItem };
  },

  updateMany: async (resource, params) => {
    const data = db[resource] || [];
    const updatedIds: string[] = [];
    params.ids.forEach((id) => {
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        data[index] = { ...data[index], ...params.data };
        updatedIds.push(id);
      }
    });
    return { data: updatedIds };
  },

  delete: async (resource, params) => {
    const data = db[resource] || [];
    const index = data.findIndex((item) => item.id === params.id);
    if (index === -1) {
      if (REAL_RESOURCES.includes(resource)) return { data: { id: params.id } as any };
      throw new Error(`Item not found: ${resource}/${params.id}`);
    }
    const deletedItem = data[index];
    data.splice(index, 1);
    return { data: deletedItem };
  },

  deleteMany: async (resource, params) => {
    const data = db[resource] || [];
    const deletedIds: string[] = [];
    params.ids.forEach((id) => {
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        data.splice(index, 1);
        deletedIds.push(id);
      }
    });
    return { data: deletedIds };
  },
};

