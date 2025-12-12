# Environment Variables Example

Copy this content to create your `.env` file in the root directory.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bora_db"
DIRECT_URL="postgresql://user:password@localhost:5432/bora_db"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Payment Processing)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Pusher (Realtime Chat)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"

# Supabase (Storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application URLs
APP_URL="http://localhost:3000"
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"

# Expo Public Keys (Mobile Apps)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
EXPO_PUBLIC_PUSHER_KEY="your-pusher-key"
EXPO_PUBLIC_PUSHER_CLUSTER="us2"
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Setup Instructions

1. Copy the content above to a new `.env` file in the project root
2. Replace all placeholder values with your actual credentials
3. For Pusher: Sign up at https://pusher.com and create a new app
4. For Stripe: Get your keys from https://dashboard.stripe.com/test/apikeys
5. For Supabase: Create a project at https://supabase.com

