# 🧪 Credenciais e Perfis de Teste (Seed Completo)

O banco de dados foi populado com sucesso com perfis realistas de Instrutores e Alunos para validação completa do sistema.

## 👨‍🏫 Perfil Instrutor (4 Perfis)

Use estes e-mails para testar o **App Instrutor** (Login) e visualizar no **Painel Admin**.

| Nome | E-mail | Carro | Localização (Fictícia) | Perfil |
| :--- | :--- | :--- | :--- | :--- |
| **Carlos Silva** | `carlos@bora.com` | Honda Civic (Preto) | Centro, BH | Experiente, Pacote Baliza |
| **Ana Souza** | `ana@bora.com` | Fiat Mobi (Branco) | Savassi, BH | Iniciantes, Aulas Noturnas |
| **Roberto Mendes** | `roberto@bora.com` | Toyota Corolla (Prata)| Pampulha, BH | VIP, Carro Automático |
| **Julia Lima** | `julia@bora.com` | Hyundai HB20 (Vermelho)| Contagem, MG | Pacote Carta Completa |

*Nota: A agenda de cada instrutor já vem pré-configurada (Turnos Manhã, Tarde ou Noite).*

## 👨‍🎓 Perfil Aluno (3 Perfis)

Use estes e-mails para testar o **App Aluno** (Login) e solicitar aulas.

| Nome | E-mail | CPF Mock | Saldo Inicial |
| :--- | :--- | :--- | :--- |
| **Lucas Aluno** | `lucas@aluno.com` | `111-Lucas...` | 0 |
| **Mariana Aluno** | `mari@aluno.com` | `111-Mariana...`| 0 |
| **Pedro Aluno** | `pedro@aluno.com` | `111-Pedro...` | 0 |

## ⚙️ Como os dados foram gerados?
- Script executado: `packages/db/prisma/seed.ts`
- Comando: `npx prisma db seed`
- Dados incluem:
    - **Usuários** (`User`)
    - **Perfis** (`Instructor` / `Student`)
    - **Veículos** (`Vehicle` com fotos placeholder)
    - **Pacotes Personalizados** (`Plan`)
    - **Disponibilidade** (`InstructorAvailability` - Agenda)
    - **Habilidades** (`Skill` - Controle de Embreagem, etc.)
    - **Pacotes Globais** (`Bundle`)

## 🚀 Próximos Passos
1. Faça login no App Aluno com `lucas@aluno.com`.
2. **Importante:** Defina a localização do seu emulador para **Belo Horizonte (-19.9167, -43.9345)** para ver os instrutores no mapa.
3. O mapa deve mostrar os 4 instrutores nas regiões de BH/Contagem.
3. Solicite uma aula com o **Carlos** (Pacote Baliza).
4. Verifique a agenda dele (Manhã/Tarde habilitados).
