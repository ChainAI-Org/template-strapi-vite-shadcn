# Strapi + Vite Shadcn Template

A full-stack monorepo template featuring Strapi as a headless CMS with a Vite React frontend using shadcn/ui components.

## Structure

- `/frontend` - Vite + React + TypeScript + Shadcn UI
- `/backend` - Strapi CMS with PostgreSQL database

## Features

- Fully TypeScript for both frontend and backend
- PostgreSQL database for robust data management
- Shadcn/UI components for beautiful, accessible UI
- Strapi CMS for content management
- Monorepo setup with coordinated development scripts

## Getting Started

1. Install dependencies:
   ```bash
   npm run setup
   ```

2. Create a managed database using the MCP tool with these parameters:
   ```json
   {
     "db_type": "postgres",
     "appPath": "{databasename}-{uniqueid}"
   }
   ```

3. Add the created database credentials to the `.env` file before proceeding with Strapi installation:
   ```
   DATABASE_CLIENT=postgres
   DATABASE_HOST=your_db_host
   DATABASE_PORT=5432
   DATABASE_NAME=your_db_name
   DATABASE_USERNAME=your_db_username
   DATABASE_PASSWORD=your_db_password
   DATABASE_SSL=true
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

5. Access:
   - Frontend: http://localhost:5173
   - Strapi Admin: http://localhost:1337/admin

## Development

- Frontend uses Vite for fast HMR and development
- Strapi uses PostgreSQL for robust data management and scalability
- Type generation automatically creates TypeScript types from Strapi models

## Deployment

The frontend and CMS can be deployed separately in production environments or together depending on your needs.

## License

MIT
