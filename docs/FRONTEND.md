# Frontend Development Guide

This guide provides comprehensive information for frontend development on the Game Hub application.

## Table of Contents

- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Component Guidelines](#component-guidelines)
- [Styling with Chakra UI](#styling-with-chakra-ui)
- [State Management](#state-management)
- [Data Fetching](#data-fetching)
- [Routing](#routing)
- [Type Safety](#type-safety)
- [Performance Considerations](#performance-considerations)
- [Build Process](#build-process)
- [Troubleshooting](#troubleshooting)

## Project Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── ui/             # Base UI provider components
│   └── *.tsx           # Feature-specific components
├── data/               # Static data and constants
├── entities/           # TypeScript type definitions
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API clients and external services
├── routes.tsx          # Application routing configuration
├── store.ts            # Global state management
├── theme.ts            # Chakra UI theme configuration
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Git

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaMirzaei/game-hub.git
   cd game-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## Architecture Overview

### Technology Stack

- **React 19**: Latest version with improved concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Chakra UI v3**: Modern React component library
- **TanStack Query**: Server state management and caching
- **Zustand**: Lightweight client state management
- **React Router DOM**: Declarative routing

### Key Design Patterns

1. **Component Composition**: Small, reusable components
2. **Custom Hooks**: Business logic separation
3. **Service Layer**: API abstraction
4. **Type Safety**: Comprehensive TypeScript usage

## Component Guidelines

### Component Structure

```tsx
// ComponentName.tsx
import { Box, Text } from '@chakra-ui/react';
import { ComponentProps } from './ComponentName.types';

interface ComponentNameProps {
  title: string;
  children?: React.ReactNode;
}

const ComponentName = ({ title, children }: ComponentNameProps) => {
  return (
    <Box>
      <Text>{title}</Text>
      {children}
    </Box>
  );
};

export default ComponentName;
```

### Best Practices

1. **Use functional components** with hooks
2. **Props interface** should be explicitly defined
3. **Default exports** for components
4. **Descriptive names** following PascalCase
5. **Compose small components** rather than large ones

### Component Categories

- **Pages**: Route-level components (`HomePage`, `GameDetailsPage`)
- **Layout**: Structure components (`Layout`, `NavBar`)
- **UI**: Reusable interface elements (`GameCard`, `CriticScore`)
- **Form**: Input and form-related components

## Styling with Chakra UI

### Theme Configuration

The application uses a custom Chakra UI theme defined in `src/theme.ts`:

```typescript
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const theme = createSystem(defaultConfig, {
  // Custom theme configuration
})
```

### Component Styling

```tsx
import { Box, Text } from '@chakra-ui/react';

const StyledComponent = () => (
  <Box
    p={4}              // padding: 1rem
    bg="gray.100"      // background color
    borderRadius="md"  // border radius
  >
    <Text fontSize="lg" fontWeight="bold">
      Styled text
    </Text>
  </Box>
);
```

### Responsive Design

```tsx
<Box
  width={{ base: "100%", md: "50%" }}
  fontSize={{ base: "sm", md: "md", lg: "lg" }}
>
  Responsive content
</Box>
```

### Dark Mode Support

The app includes theme switching functionality:

```tsx
import { useColorMode } from '@chakra-ui/react';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
};
```

## State Management

### Zustand Store

Global state is managed using Zustand in `src/store.ts`:

```typescript
import { create } from "zustand";

interface GameQueryStore {
  gameQuery: GameQuery;
  setSearchText: (searchText: string) => void;
  setGenreId: (genreId: number) => void;
  setPlatformId: (platformId: number) => void;
  setSortOrder: (sortOrder: string) => void;
}

const useGameQueryStore = create<GameQueryStore>((set) => ({
  gameQuery: {},
  setSearchText: (searchText) => set(() => ({ gameQuery: { searchText } })),
  // ... other setters
}));
```

### Usage in Components

```tsx
import useGameQueryStore from '../store';

const SearchComponent = () => {
  const { gameQuery, setSearchText } = useGameQueryStore();
  
  return (
    <Input
      value={gameQuery.searchText || ''}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Search games..."
    />
  );
};
```

## Data Fetching

### TanStack Query Setup

Data fetching uses TanStack Query for caching and synchronization:

```tsx
// hooks/useGames.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import APIClient from '../services/api-client';

const apiClient = new APIClient<Game>('/games');

const useGames = (gameQuery: GameQuery) =>
  useInfiniteQuery({
    queryKey: ['games', gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          genres: gameQuery.genreId,
          platforms: gameQuery.platformId,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
          page: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
  });
```

### Custom Hooks Pattern

```tsx
// hooks/useGame.ts
import { useQuery } from '@tanstack/react-query';

const useGame = (slug: string) =>
  useQuery({
    queryKey: ['games', slug],
    queryFn: () => apiClient.get(slug),
  });

// Usage in component
const GameDetails = ({ slug }: { slug: string }) => {
  const { data: game, isLoading, error } = useGame(slug);
  
  if (isLoading) return <Spinner />;
  if (error) return <Text>Error loading game</Text>;
  
  return <div>{game?.name}</div>;
};
```

## Routing

### Route Configuration

Routes are defined in `src/routes.tsx`:

```tsx
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'games/:slug', element: <GameDetailsPage /> }
    ]
  }
]);
```

### Navigation

```tsx
import { Link, useNavigate } from 'react-router-dom';

const GameCard = ({ game }: { game: Game }) => {
  const navigate = useNavigate();
  
  return (
    <Box onClick={() => navigate(`/games/${game.slug}`)}>
      <Link to={`/games/${game.slug}`}>
        {game.name}
      </Link>
    </Box>
  );
};
```

## Type Safety

### Entity Definitions

Types are defined in `src/entities/`:

```typescript
// entities/Game.ts
export interface Game {
  id: number;
  name: string;
  slug: string;
  genres: Genre[];
  platforms: Platform[];
  metacritic: number;
  background_image: string;
}

// entities/Genre.ts
export interface Genre {
  id: number;
  name: string;
  image_background: string;
}
```

### API Response Types

```typescript
export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}
```

## Performance Considerations

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

const GameDetailsPage = lazy(() => import('./pages/GameDetailsPage'));

// Usage with Suspense
<Suspense fallback={<Spinner />}>
  <GameDetailsPage />
</Suspense>
```

### Image Optimization

```tsx
// services/image-url.ts
const getCroppedImageUrl = (url: string) => {
  if (!url) return noImage;
  
  const target = 'media/';
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + 'crop/600/400/' + url.slice(index);
};
```

### Infinite Scrolling

```tsx
import InfiniteScroll from 'react-infinite-scroll-component';

const GameGrid = () => {
  const { data, fetchNextPage, hasNextPage } = useGames(gameQuery);
  
  return (
    <InfiniteScroll
      dataLength={data?.pages.reduce((total, page) => total + page.results.length, 0) || 0}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<Spinner />}
    >
      {/* Game cards */}
    </InfiniteScroll>
  );
};
```

## Build Process

### Development Build

```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Source maps
- Fast refresh
- Development server at `localhost:5173`

### Production Build

```bash
npm run build
```

Output:
- Optimized bundle in `dist/` directory
- Code splitting
- Asset optimization
- Tree shaking

### Build Analysis

```bash
npm run build -- --analyze
```

### Environment Variables

Create `.env.local` for local development:

```env
VITE_API_KEY=your_rawg_api_key
VITE_API_BASE_URL=https://api.rawg.io/api
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Node modules issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

4. **Build failures**
   ```bash
   # Clear Vite cache
   npx vite --force
   ```

### Development Tools

- **React Developer Tools**: Browser extension for React debugging
- **React Query Devtools**: Built-in query inspection (enabled in development)
- **ESLint**: Code quality and style checking
- **TypeScript**: Compile-time type checking

### Performance Monitoring

```tsx
// Add performance monitoring
if (import.meta.env.DEV) {
  // Development-only monitoring
  console.log('Performance metrics:', performance.timing);
}
```

## Next Steps

- Explore the [API Integration Guide](API.md)
- Review [Architecture Overview](ARCHITECTURE.md)
- Check [Contributing Guidelines](CONTRIBUTING.md)