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

const db: Record<string, any[]> = {
  students,
  instructors,
  lessons,
  payments,
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const data = db[resource] || [];
    
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
    const data = db[resource] || [];
    const item = data.find((item) => item.id === params.id);
    if (!item) {
      throw new Error(`Item not found: ${resource}/${params.id}`);
    }
    return { data: item };
  },

  getMany: async (resource, params) => {
    const data = db[resource] || [];
    const items = data.filter((item) => params.ids.includes(item.id));
    return { data: items };
  },

  getManyReference: async (resource, params) => {
    const data = db[resource] || [];
    const filteredData = data.filter(
      (item) => item[params.target] === params.id
    );
    return {
      data: filteredData,
      total: filteredData.length,
    };
  },

  create: async (resource, params) => {
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

