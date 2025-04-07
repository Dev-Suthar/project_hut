# The Product Highway Website - Project Structure

## Overview

This document outlines the structure and organization of The Product Highway website project. The project is built using React with TypeScript and Vite as the build tool.

## Root Directory Structure

```
tph_website/
├── src/                 # Source code directory
├── index.html           # Entry HTML file
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

## Source Code Structure (`src/`)

The source code is organized into several key directories:

### 1. Core Application Files

- `src/Main.tsx` - Root component
- `index.css` and `App.css` - Global styles
- `tsconfig.ts` - TypeScript declarations for Vite
- `vite-env.d.ts` - Vite declarations for Vite
- `tailwind.config.js` - Tailwind css declarations

### 2. Router (`src/app-router/`)

Application routing configuration:

- `Router.tsx` - Main router configuration
- Route definitions and navigation logic

### 3. Layout (`src/layout/`)

Layout components that define the structure of different pages:

- `PageLayout.tsx` - Main layout wrapper

### 4. Pages (`src/pages/`)

Each page of the application is organized in its own directory:

- `home/` - Homepage components and sections
- `portfolio/` - Portfolio page components
- `join-us/` - Careers page components

### 5. Components (`src/components/`)

Reusable UI components that can be used across different pages.

- Common UI elements
- Shared functionality components
- Layout components

### 6. Assets (`src/assets/`)

Static assets used throughout the application:

- `fonts/` - Font files
- Images and icons
- Other static resources

### 7. Constants (`src/const/`)

Application constants and configuration:

- Static data

## Development Guidelines

#### 1. **Component Organization**:

- Place reusable components in `src/components/`
- Page-specific components go in their respective page directories
- Keep components small and focused on a single responsibility

#### 2. **Styling**:

- Use CSS modules for component-specific styles
- Global styles should be in `index.css`
- Follow the established design system

#### 3. **Routing**:

- All routes are defined in `app-router/Router.tsx`
- Use the provided layout components for consistent page structure

#### 4. **Assets**:

- Place all static assets in the `assets` directory
- Use appropriate subdirectories for organization (fonts, images, etc.)

#### Build and Deployment

The project uses Vite for building and bundling:

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## Dependencies

Key dependencies are managed in `package.json`:

- React and React DOM
- TypeScript
- Vite
- GSAP (for animations)
- Other utility libraries

## Configuration Files

- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - TypeScript configuration
- `.gitignore` - Git ignore rules

## Best Practices

- Follow the established folder structure
- Use TypeScript for all new components
- Keep components modular and reusable
- Follow the established naming conventions
- Document complex components and functions
- Test components where appropriate

## Getting Started

- Clone the repository
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build for production: `npm run build`

## Creating a New Module

### 1. Module Structure

When adding a new module (e.g., Join Us page), follow this structure:

```
src/
└── pages/
    └── join-us/                    # Module directory (kebab-case)
        ├── JoinUs.tsx             # Main page component (PascalCase)
        ├── JoinUs.css             # Module-specific styles
        └── components/            # Module-specific components
            ├── JoinForm.tsx
            ├── BenefitsSection.tsx
            └── ...
```

### 2. Naming Conventions

- **Directories**: Use kebab-case (e.g., `join-us`, `contact-us`)
- **Component Files**: Use PascalCase (e.g., `JoinUs.tsx`, `ContactForm.tsx`)
- **Component Names**: Match file names (e.g., `const JoinUs: React.FC = () => {...}`)
- **CSS Files**: Match component names (e.g., `JoinUs.css`)

### 3. Component Organization

- **Module-specific Components**: Place inside the module's `components` directory
- **Common Components**: Place in `src/components` if used across multiple modules
- **Layout Components**: Place in `src/layout` if defining page structure

### 4. Asset Organization

```
src/
└── assets/
    ├── fonts/                    # Font files
    │   ├── Aspekta-700.ttf
    │   └── ...
    ├── images/                   # Image assets
    │   └── join-us/             # Module-specific images
    └── icons/                    # Icon assets
```

## Router Setup

### 1. Adding New Routes

To add a new route, modify `src/app-router/Router.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinUs from "../pages/join-us/JoinUs";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        // ... existing routes ...
        <Route
          path="/join-us"
          element={
            <MainLayout>
              <JoinUs />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
```

### 2. Route Configuration Guidelines

- Use kebab-case for route paths (e.g., `/join-us`, `/contact-us`)
- Wrap page components with `MainLayout` for consistent structure
- Group related routes using nested routes when needed
- Use lazy loading for better performance:

```typescript
const JoinUs = lazy(() => import("../pages/join-us/JoinUs"));

<Route
  path="/join-us"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <MainLayout>
        <JoinUs />
      </MainLayout>
    </Suspense>
  }
/>;
```

### 3. Navigation

Use the `Link` component from `react-router-dom` for internal navigation:

```typescript
import { Link } from "react-router-dom";

<Link to="/join-us">Join Us</Link>;
```

## Module Development Workflow

1. **Create Module Structure**

   ```bash
   mkdir -p src/pages/join-us/components
   touch src/pages/join-us/JoinUs.tsx
   touch src/pages/join-us/JoinUs.css
   ```

2. **Add Module-specific Components**

   - Create components in the module's `components` directory
   - Import and use them in the main module component

3. **Add Styles**

   - Use CSS modules for component-specific styles
   - Add global styles to `index.css` if needed

4. **Update Router**

   - Add the new route to `Router.tsx`
   - Configure layout and any necessary route parameters

5. **Add Assets**

   - Place module-specific images in `assets/images/module-name/`
   - Use common assets from their respective directories

6. **Testing**
   - Test the module in isolation
   - Verify routing and navigation
   - Check responsive behavior

## Example Module Structure

```
src/
├── pages/
│   └── join-us/
│       ├── JoinUs.tsx
│       ├── JoinUs.css
│       └── components/
│           ├── JoinForm/
│           │   ├── JoinForm.tsx
│           │   └── JoinForm.css
│           └── BenefitsSection/
│               ├── BenefitsSection.tsx
│               └── BenefitsSection.css
├── components/
│   └── Button/
│   └── Input/
├── assets/
│    ├── fonts/
│    └── images/
│        └── hero.png
│        └── testimonial.png
├── const/
│    └── joinus-data
│    └── projects
├── app-router/
│    └── Router.tsx
```
