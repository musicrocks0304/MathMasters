# Math Practice Pro - Addition & Subtraction with Regrouping

## Overview

Math Practice Pro is an interactive web application designed to help users master addition and subtraction problems with regrouping (carrying/borrowing). The application provides a comprehensive learning experience with visual helpers, progress tracking, and adaptive difficulty levels for 2-4 digit arithmetic problems.

The system is built as a full-stack application with a React frontend and Express.js backend, featuring a modern UI built with shadcn/ui components and Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming and responsive design
- **State Management**: React hooks (useState, useEffect) for local component state
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for type safety across the entire application
- **Development**: tsx for TypeScript execution in development mode
- **Session Management**: Prepared for PostgreSQL session storage using connect-pg-simple
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL configured through Neon serverless database connection
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema**: Defined in shared TypeScript files for consistency between client and server
- **Migrations**: Managed through drizzle-kit for database schema evolution
- **Validation**: Zod schemas for runtime type checking and data validation

### Authentication and Authorization
- **User Model**: Basic user entity with username/password fields and UUID primary keys
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Session Persistence**: Cookie-based sessions with PostgreSQL backing store

### Development and Deployment
- **Monorepo Structure**: Client, server, and shared code organized in separate directories
- **Path Aliases**: TypeScript path mapping for clean imports (@/, @shared/)
- **Development Server**: Vite dev server with HMR integration
- **Production Build**: Separate client and server builds with esbuild for server bundling
- **Environment**: Replit-optimized with development tools and error overlays

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives (dialog, dropdown, tooltip, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library providing consistent iconography
- **Class Variance Authority**: Type-safe utility for managing conditional CSS classes

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **PostCSS**: CSS processing with Tailwind CSS integration

### Database and Validation
- **Neon Database**: Serverless PostgreSQL database service
- **Drizzle ORM**: Modern TypeScript ORM with type-safe query building
- **Zod**: Runtime type validation and schema definition library
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

### Frontend Libraries
- **React Hook Form**: Performant form handling with minimal re-renders
- **TanStack Query**: Server state management with caching and synchronization
- **Date-fns**: Modern date utility library for date formatting and manipulation
- **Embla Carousel**: Lightweight carousel component for interactive elements

### Replit Integration
- **Replit Vite Plugins**: Development-specific plugins for runtime error handling and debugging
- **Environment Detection**: Conditional loading of development tools based on Replit environment