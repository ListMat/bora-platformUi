# Sistema de Cadastro de Veículos

Sistema completo de cadastro e gerenciamento de veículos para instrutores e alunos da plataforma BORA.

## 📋 Funcionalidades

### Para Instrutores
- Cadastro obrigatório de veículo com duplo-pedal
- Upload de foto do veículo (obrigatório)
- Upload de foto do duplo-pedal (obrigatório)
- Opção de aceitar ministrar aulas no carro do aluno
- Listagem e gerenciamento de veículos cadastrados

### Para Alunos
- Cadastro opcional de veículo
- Upload de foto do veículo
- Duplo-pedal opcional
- Listagem de veículos cadastrados

## 🏗️ Estrutura de Arquivos

```
apps/web-admin/src/app/vehicles/
├── components/
│   ├── VehicleForm.tsx          # Formulário em 3 steps
│   └── UploadArea.tsx            # Componente de upload de fotos
├── schema/
│   └── vehicleSchema.ts          # Validação Zod
├── utils/
│   └── vehicleOptions.ts         # Opções de marcas, cores, etc.
├── hooks/
│   └── useBrandsAndModels.ts     # Hook para marcas e modelos
├── __tests__/
│   └── vehicleSchema.test.ts     # Testes de validação
├── page.tsx                      # Página principal
└── README.md                     # Esta documentação
```

## 🚀 Como Usar

### 1. Rodar o Projeto

```bash
# Na raiz do projeto
pnpm dev
```

### 2. Acessar a Página

Navegue para: `http://localhost:3000/vehicles`

### 3. Cadastrar um Veículo

1. Clique em "Novo Veículo"
2. **Step 1 - Dados Básicos:**
   - Faça upload da foto do veículo (frontal ou lateral)
   - Selecione marca e modelo
   - Informe ano, cor e últimos 4 dígitos da placa

3. **Step 2 - Especificações:**
   - Selecione categoria, câmbio, combustível
   - Informe motor e potência (opcional)

4. **Step 3 - Segurança & Acessórios:**
   - Marque "Duplo-pedal instalado" (obrigatório para instrutores)
   - Se marcado, faça upload da foto do pedal
   - Selecione itens de segurança e conforto
   - Para instrutores: opção de aceitar carro do aluno

5. Clique em "Cadastrar Veículo"

## 🔐 Regras de Negócio

### Validações

- **Foto do veículo:** Obrigatória, formato .jpg ou .png, máximo 5MB
- **Placa:** 4 últimos caracteres (letras e números)
- **Ano:** Entre 1980 e 2026
- **Duplo-pedal:** 
  - Obrigatório TRUE para instrutores
  - Opcional para alunos
  - Se marcado, foto do pedal é obrigatória para instrutores
- **Marca e modelo:** Obrigatórios
- **Categoria, câmbio, combustível:** Obrigatórios

### Permissões

- **Usuário:** Pode visualizar e gerenciar apenas seus próprios veículos
- **Admin:** Pode visualizar e gerenciar todos os veículos

### Storage

- Fotos são armazenadas no Supabase Storage no bucket `vehicle-photos`
- Estrutura: `{vehicleId}/main/{filename}` e `{vehicleId}/pedal/{filename}`
- GPS EXIF metadata é removido automaticamente (LGPD)

## 🧪 Testes

```bash
# Rodar testes
cd apps/web-admin
pnpm test

# Rodar testes específicos
pnpm test vehicleSchema
```

## 📝 Variáveis de Ambiente

Certifique-se de que o arquivo `.env` na raiz do projeto contém:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase (para upload de fotos)
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

## 🗄️ Schema do Banco de Dados

```prisma
model Vehicle {
  id               String            @id @default(cuid())
  userId           String
  
  // Dados básicos
  brand            String
  model            String
  year             Int
  color            String
  plateLastFour    String
  photoUrl         String
  
  // Especificações
  category         VehicleCategory
  transmission     TransmissionType
  fuel             FuelType
  engine           String
  horsePower       Int?
  
  // Duplo-pedal
  hasDualPedal     Boolean @default(false)
  pedalPhotoUrl    String?
  
  // Opções
  acceptStudentCar Boolean @default(false)
  
  // Arrays
  safetyFeatures   String[]
  comfortFeatures  String[]
  
  // Status
  status           String @default("active")
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  user             User @relation(...)
}
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **tRPC** - API type-safe
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Supabase Storage** - Armazenamento de fotos
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **shadcn/ui** - Componentes UI
- **react-dropzone** - Upload de arquivos
- **Tailwind CSS** - Estilização

## 🎨 UX Writing

### Placeholders
- Marca: "Ex: Toyota"
- Modelo: "Ex: Corolla"
- Motor: "Ex: 2.0"
- Potência: "Ex: 140"
- Placa: "Ex: 1D23"

### Helper Texts
- Placa: "Digite os 4 últimos caracteres (letras e números)"
- Duplo-pedal (instrutor): "Obrigatório para aulas regulares. Kit homologado pelo Detran."
- Duplo-pedal (aluno): "Marque apenas se já possui o kit homologado"
- Aceita carro do aluno: "Economize 15% - veja regulamento"

### Mensagens de Sucesso/Erro
- **Sucesso:** "Veículo cadastrado com sucesso!"
- **Erro upload:** "Foto muito pesada. Máximo 5MB."
- **Erro placa:** "Formato inválido (ex: 1D23)"
- **Erro ano:** "Ano deve estar entre 1980 e 2026"
- **Erro pedal:** "Foto do pedal obrigatória quando duplo-pedal está marcado"

## 📱 Responsividade

- **Mobile:** Layout em coluna única, stepper vertical
- **Tablet (≥768px):** Grid 2 colunas para selects
- **Desktop (≥1024px):** Grid 3 colunas para cards de veículos

## 🔍 Acessibilidade

- Todos os inputs possuem `aria-label`
- Campos com erro possuem `aria-invalid` e `aria-describedby`
- Navegação por teclado (Tab) funcional
- Cores com contraste adequado (WCAG AA)

## 🐛 Troubleshooting

### Erro: "Supabase credentials missing"
**Solução:** Configure as variáveis de ambiente no `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

### Erro: "Failed to upload vehicle photo"
**Possíveis causas:**
1. Bucket `vehicle-photos` não existe no Supabase
2. Permissões incorretas no bucket
3. Foto maior que 5MB

**Solução:**
1. Criar bucket no Supabase Dashboard
2. Configurar permissões: public read, authenticated write

### Erro: "Duplo-pedal é obrigatório para instrutores"
**Causa:** Instrutor tentando cadastrar veículo sem duplo-pedal

**Solução:** Marcar o checkbox "Duplo-pedal instalado" e fazer upload da foto

## 📚 Próximos Passos

- [ ] Implementar edição de veículos
- [ ] Adicionar visualização detalhada do veículo
- [ ] Implementar filtros na listagem
- [ ] Adicionar paginação para muitos veículos
- [ ] Implementar busca por placa/modelo
- [ ] Adicionar histórico de manutenções
- [ ] Implementar validação de documentos do veículo

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

