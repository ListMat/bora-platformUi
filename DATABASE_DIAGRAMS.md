# 📊 Diagrama ER - Sistema Bora

## Diagrama de Relacionamentos (Mermaid)

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o| Student : "is a"
    User ||--o| Instructor : "is a"
    User ||--o{ Vehicle : owns
    User ||--o{ ActivityLog : generates
    
    Student ||--o{ Lesson : books
    Student ||--o{ Payment : makes
    Student ||--o{ Rating : gives
    Student ||--o{ Referral : refers
    Student ||--o| Referral : "referred by"
    Student ||--o{ BundlePurchase : purchases
    Student ||--o{ SkillEvaluation : receives
    
    Instructor ||--o{ Lesson : teaches
    Instructor ||--o{ InstructorAvailability : has
    Instructor ||--o{ Plan : offers
    Instructor ||--o{ Rating : receives
    Instructor ||--o{ SkillEvaluation : gives
    
    Lesson ||--|| Payment : "paid with"
    Lesson ||--o| Rating : "rated by"
    Lesson ||--o{ ChatMessage : contains
    Lesson ||--o{ SkillEvaluation : evaluates
    Lesson ||--o| CancellationPolicy : "cancelled with"
    
    Payment ||--o| Dispute : "disputed by"
    Payment ||--o| PaymentSplit : "split into"
    
    Bundle ||--o{ BundlePurchase : "purchased as"
    BundlePurchase ||--|| BundlePayment : "paid with"
    
    Skill ||--o{ SkillEvaluation : "evaluated in"
    
    User {
        string id PK
        string email UK
        string name
        string password
        enum role
        string phone
        string image
        string pushToken
        datetime emailVerified
        datetime createdAt
        datetime updatedAt
    }
    
    Student {
        string id PK
        string userId FK
        string cpf UK
        datetime dateOfBirth
        string address
        string city
        string state
        string zipCode
        int points
        int level
        array badges
        decimal walletBalance
        datetime createdAt
        datetime updatedAt
    }
    
    Instructor {
        string id PK
        string userId FK
        string cpf UK
        string cnhNumber UK
        string credentialNumber
        datetime credentialExpiry
        string cnhDocument
        string credentialDoc
        string cep
        string street
        string neighborhood
        float latitude
        float longitude
        string city
        string state
        decimal basePrice
        boolean isAvailable
        boolean isOnline
        boolean acceptsOwnVehicle
        string bio
        enum status
        float averageRating
        int totalLessons
        string stripeAccountId UK
        boolean stripeOnboarded
        boolean stripeChargesEnabled
        boolean stripePayoutsEnabled
        datetime createdAt
        datetime updatedAt
    }
    
    Lesson {
        string id PK
        string studentId FK
        string instructorId FK
        datetime scheduledAt
        datetime startedAt
        datetime endedAt
        int duration
        string lessonType
        string vehicleId
        boolean useOwnVehicle
        string planId
        enum paymentMethod
        int installments
        float pickupLatitude
        float pickupLongitude
        string pickupAddress
        float currentLatitude
        float currentLongitude
        enum status
        decimal price
        boolean usedBundleCredit
        string bundlePurchaseId
        string recordingUrl
        boolean recordingConsent
        string receiptUrl
        string pixCode
        string pixQrCode
        datetime pixGeneratedAt
        datetime pixExpiresAt
        datetime pixPaidAt
        string paymentStatus
        string instructorNotes
        string studentNotes
        datetime createdAt
        datetime updatedAt
    }
    
    Payment {
        string id PK
        string lessonId FK
        string studentId FK
        decimal amount
        enum method
        enum status
        string stripePaymentId UK
        string stripeCustomerId
        string pixQrCode
        string pixCopyPaste
        json metadata
        datetime createdAt
        datetime updatedAt
    }
    
    Vehicle {
        string id PK
        string userId FK
        string brand
        string model
        int year
        string color
        string plateLastFour
        string photoUrl
        array photos
        enum category
        enum transmission
        enum fuel
        string engine
        int horsePower
        boolean hasDualPedal
        string pedalPhotoUrl
        boolean acceptStudentCar
        array safetyFeatures
        array comfortFeatures
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    Rating {
        string id PK
        string lessonId FK
        string studentId FK
        string instructorId FK
        int rating
        string comment
        datetime createdAt
    }
```

## Diagrama Simplificado (Fluxo Principal)

```mermaid
graph TD
    A[User] -->|é| B[Student]
    A -->|é| C[Instructor]
    
    B -->|agenda| D[Lesson]
    C -->|ministra| D
    
    D -->|gera| E[Payment]
    E -->|pode ter| F[Dispute]
    E -->|divide em| G[PaymentSplit]
    
    D -->|tem| H[Rating]
    D -->|contém| I[ChatMessage]
    D -->|avalia| J[SkillEvaluation]
    
    B -->|compra| K[BundlePurchase]
    K -->|de| L[Bundle]
    K -->|paga com| M[BundlePayment]
    
    B -->|indica| N[Referral]
    
    C -->|tem| O[InstructorAvailability]
    C -->|oferece| P[Plan]
    
    A -->|possui| Q[Vehicle]
    A -->|gera| R[ActivityLog]
    
    style D fill:#f9f,stroke:#333,stroke-width:4px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style H fill:#bfb,stroke:#333,stroke-width:2px
```

## Fluxo de Agendamento de Aula

```mermaid
sequenceDiagram
    participant S as Student
    participant L as Lesson
    participant I as Instructor
    participant P as Payment
    participant R as Rating
    
    S->>L: Cria agendamento (PENDING)
    L->>I: Notifica instrutor
    I->>L: Aceita (SCHEDULED)
    L->>P: Gera pagamento
    S->>P: Paga (Pix/Cartão)
    P->>L: Confirma pagamento
    L->>L: Inicia aula (ACTIVE)
    L->>L: Finaliza aula (FINISHED)
    S->>R: Avalia instrutor
    R->>I: Atualiza averageRating
```

## Fluxo de Pagamento

```mermaid
stateDiagram-v2
    [*] --> PENDING: Aula agendada
    PENDING --> PROCESSING: Pagamento iniciado
    PROCESSING --> COMPLETED: Pagamento confirmado
    PROCESSING --> FAILED: Pagamento falhou
    COMPLETED --> REFUNDED: Reembolso solicitado
    FAILED --> PENDING: Tentar novamente
    REFUNDED --> [*]
    COMPLETED --> [*]
```

## Status de Aula

```mermaid
stateDiagram-v2
    [*] --> PENDING: Aluno agenda
    PENDING --> SCHEDULED: Instrutor aceita
    PENDING --> EXPIRED: Sem resposta (2min)
    SCHEDULED --> ACTIVE: Aula iniciada
    SCHEDULED --> CANCELLED: Cancelada
    ACTIVE --> FINISHED: Aula concluída
    CANCELLED --> [*]
    EXPIRED --> [*]
    FINISHED --> [*]
```

## Hierarquia de Usuários

```mermaid
graph TD
    A[User] --> B{Role}
    B -->|ADMIN| C[Admin Panel]
    B -->|FINANCIAL| D[Financial Panel]
    B -->|SUPPORT| E[Support Panel]
    B -->|AUDITOR| F[Audit Panel]
    B -->|INSTRUCTOR| G[Instructor App]
    B -->|STUDENT| H[Student App]
    
    C --> I[Full Access]
    D --> J[Payments & Reports]
    E --> K[Support Tickets]
    F --> L[Activity Logs]
    G --> M[Teach Lessons]
    H --> N[Book Lessons]
```

## Gamificação do Aluno

```mermaid
graph LR
    A[Student] -->|ganha| B[Points]
    B -->|aumenta| C[Level]
    C -->|desbloqueia| D[Badges]
    
    E[Lesson Completed] -->|+10| B
    F[Referral] -->|+50| B
    G[Bundle Purchase] -->|+20| B
    H[Perfect Rating] -->|+5| B
    
    C -->|Level 5| I[Bronze Badge]
    C -->|Level 10| J[Silver Badge]
    C -->|Level 20| K[Gold Badge]
```

## Sistema de Indicação

```mermaid
graph TD
    A[Student A] -->|indica| B[Student B]
    B -->|cadastra| C[Referral criada]
    C -->|rewardPaid: false| D[Pendente]
    B -->|completa 1ª aula| E[Trigger]
    E -->|rewardPaid: true| F[Recompensa paga]
    F -->|+R$ 50| G[Wallet de A]
    F -->|+R$ 25| H[Wallet de B]
```

## Integração Stripe

```mermaid
graph TD
    A[Instructor] -->|cria conta| B[Stripe Connect]
    B -->|onboarding| C[stripeOnboarded: true]
    C -->|habilita| D[stripeChargesEnabled: true]
    C -->|habilita| E[stripePayoutsEnabled: true]
    
    F[Payment] -->|COMPLETED| G[PaymentSplit]
    G -->|platformFee| H[Plataforma]
    G -->|instructorAmount| I[Transfer]
    I -->|Stripe| J[Conta do Instrutor]
```

## Avaliação de Skills

```mermaid
graph LR
    A[Lesson FINISHED] --> B[Instructor]
    B -->|avalia| C[SkillEvaluation]
    C -->|Baliza: 4/5| D[Skill 1]
    C -->|Conversão: 5/5| E[Skill 2]
    C -->|Embreagem: 3/5| F[Skill 3]
    
    D --> G[Student Progress]
    E --> G
    F --> G
    
    G -->|média| H[Overall Score]
```

---

**Como visualizar:**
1. Copie o código Mermaid
2. Cole em: https://mermaid.live
3. Ou use extensões VSCode/GitHub que suportam Mermaid

---

**Desenvolvido com ❤️ para Bora Platform**
