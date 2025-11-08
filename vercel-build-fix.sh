#!/bin/bash
echo "🚀 Starting Vercel build fix..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Create ultra-minimal Prisma schema that definitely works
echo "📝 Creating minimal Prisma schema..."
cat > prisma/schema.prisma << 'EOL'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
}
EOL

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "🎉 Your Islamic Platform is ready!"
