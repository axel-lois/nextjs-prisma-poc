# Architectural Decisions and Assumptions

## Project Overview
This is a full-stack Next.js application with Prisma ORM for managing posts and users.

## Folder Structure
- **/app**: Next.js App Router pages and API routes
- **/components**: Reusable React components
- **/constants**: Shared constants like API endpoints and pagination settings
- **/contexts**: Global state management with React Context
- **/hooks**: Custom hooks for data fetching and business logic
- **/lib**: Utility functions, configurations, and third-party library initializations
- **/prisma**: Database schema, migrations, and seed scripts
- **/public**: Static assets like images and icons
- **/types**: TypeScript type definitions

## How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

3. **Seed the database**:
   ```bash
   npx prisma db seed
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## General Considerations

### Technology Stack
- **Next.js App Router**: For server-side rendering, static site generation, and API routes.
- **Prisma ORM**: For type-safe database access.
- **SQLite**: As the database for simplicity and ease of setup.
- **Material-UI (MUI)**: For UI components.
- **Axios**: As a data fetching client, combined with tanstack.
- **TanStack Query**: For data fetching, caching, and state management.
- **TypeScript**: For type safety and improved developer experience.

## Offline Support

The application provides offline support for creating, updating, and deleting posts. This is achieved using a combination of a custom offline queue and TanStack Query's `persistQueryClient`.

### Offline Queue

The offline queue is implemented in `lib/offline.ts` and `hooks/useOfflineQueue.ts`. When the user is offline, any mutations (create, update, delete) are added to a queue in localStorage. When the user comes back online, the queue is processed and the mutations are sent to the server.

### TanStack Query with Persistence

TanStack Query is used to cache the data from the server. The `persistQueryClient` functionality is used to persist the query cache to localStorage. This allows the application to display the cached data when the user is offline.

The query client is configured in `app/providers.tsx` with a `staleTime` of 1 hour and a `gcTime` of 24 hours. This means that the data will be considered fresh for 1 hour, and will be garbage collected after 24 hours.

### State Management
- **TanStack Query**: Is the single source of truth for all server-state. It handles data fetching, caching, and synchronization.
- **React Context**: Is used for global UI state, such as notifications and modals.

### Search and Pagination
Search and pagination are handled on the client-side for a better user experience in low-connectivity environments. Fuse.js is used for fuzzy searching.

### Code Quality
- **ESLint and Prettier**: Are used for code linting and formatting.
- **TypeScript**: Is used throughout the project for type safety.
