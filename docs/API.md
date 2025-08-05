# API-Integration & Backend-Services

Dieses Handbuch behandelt die API-Integration und Backend-Services, die in der Game Hub-Anwendung verwendet werden.

## Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [RAWG API-Integration](#rawg-api-integration)
- [API-Client-Architektur](#api-client-architektur)
- [Datenmodelle](#datenmodelle)
- [Service Layer](#service-layer)
- [Caching-Strategie](#caching-strategie)
- [Fehlerbehandlung](#fehlerbehandlung)
- [API-Sicherheit](#api-sicherheit)
- [Rate Limiting](#rate-limiting)
- [Testen der API-Integration](#testen-der-api-integration)

## Übersicht

Game Hub ist eine reine Frontend-Anwendung, die sich mit externen APIs integriert, um Spieldaten bereitzustellen. Die primäre Datenquelle ist die RAWG Video Games Database API, die umfassende Informationen über Videospiele, Plattformen, Genres und mehr bietet.

### Architektur-Pattern

```
Frontend (React) → API Client → Externe APIs → Response Processing → State Management
```

### Schlüsseltechnologien

- **Axios**: HTTP-Client für API-Anfragen
- **TanStack Query**: Server State Management und Caching
- **TypeScript**: Typsichere API-Integration
- **Custom API Client**: Abstraktionsschicht für API-Aufrufe

## RAWG API-Integration

### Über die RAWG API

Die [RAWG Video Games Database](https://rawg.io/apidocs) ist eine umfassende API, die folgendes bietet:

- **Spiele-Datenbank**: 800.000+ Spiele mit detaillierten Informationen
- **Plattform-Daten**: Gaming-Plattformen (PC, PlayStation, Xbox, Nintendo, etc.)
- **Genre-Informationen**: Spielkategorien und -klassifikationen
- **Screenshots & Medien**: Spielbilder und Trailer
- **Spiele-Details**: Bewertungen, Beschreibungen, Veröffentlichungsdaten, Entwickler

### API-Konfiguration

```typescript
// services/api-client.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "609c406a992648298d5447723ca633bf", // API-Schlüssel
  },
});
```

### Verfügbare Endpoints

| Endpoint | Zweck | Beispiel |
|----------|-------|----------|
| `/games` | Spiele mit Filterung auflisten | `/games?genres=4&platforms=4` |
| `/games/{id}` | Spiele-Details abrufen | `/games/3498` |
| `/games/{id}/screenshots` | Spiele-Screenshots | `/games/3498/screenshots` |
| `/games/{id}/movies` | Spiele-Trailer | `/games/3498/movies` |
| `/genres` | Genres auflisten | `/genres` |
| `/platforms` | Plattformen auflisten | `/platforms` |

## API-Client-Architektur

### Generischer API-Client

```typescript
// services/api-client.ts
export interface FetcheResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}

class APICLient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config: AxiosRequestConfig) => {
    return axiosInstance
      .get<FetcheResponse<T>>(this.endpoint, config)
      .then((res) => res.data);
  };

  get = (id: number | string) => {
    return axiosInstance
      .get<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  };
}

export default APICLient;
```

### Service-Instanziierung

```typescript
// hooks/useGames.ts
import APIClient from '../services/api-client';
import { Game } from '../entities/Game';

const apiClient = new APIClient<Game>('/games');

// hooks/useGenres.ts
import { Genre } from '../entities/Genre';
const genresApiClient = new APIClient<Genre>('/genres');
```

## Datenmodelle

### Kern-Entitäten

```typescript
// entities/Game.ts
export interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  metacritic: number;
  background_image: string;
  parent_platforms: { platform: Platform }[];
  genres: Genre[];
  publishers: Publisher[];
  released: string;
  updated: string;
  rating: number;
  rating_top: number;
  playtime: number;
  platforms: GamePlatform[];
}

// entities/Platform.ts
export interface Platform {
  id: number;
  name: string;
  slug: string;
}

// entities/Genre.ts
export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

// entities/Screenshot.ts
export interface Screenshot {
  id: number;
  image: string;
  width: number;
  height: number;
}

// entities/Trailer.ts
export interface Trailer {
  id: number;
  name: string;
  preview: string;
  data: {
    480: string;
    max: string;
  };
}
```

### Query Parameters

```typescript
export interface GameQuery {
  genreId?: number;
  platformId?: number;
  sortOrder?: string;
  searchText?: string;
  page?: number;
  page_size?: number;
}
```

## Service Layer

### Custom Hooks for Data Fetching

```typescript
// hooks/useGames.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import APIClient from '../services/api-client';
import { Game } from '../entities/Game';

const apiClient = new APIClient<Game>('/games');

const useGames = (gameQuery: GameQuery) =>
  useInfiniteQuery({
    queryKey: ['games', gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getAll({
        params: {
          genres: gameQuery.genreId,
          parent_platforms: gameQuery.platformId,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchText,
          page: pageParam,
          page_size: 20,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export default useGames;
```

```typescript
// hooks/useGame.ts
import { useQuery } from '@tanstack/react-query';

const useGame = (slug: string) =>
  useQuery({
    queryKey: ['games', slug],
    queryFn: () => apiClient.get(slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

// hooks/useGenres.ts
const useGenres = () =>
  useQuery({
    queryKey: ['genres'],
    queryFn: () => genresApiClient.getAll({}),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (genres rarely change)
  });

// hooks/useScreenshots.ts
const useScreenshots = (gameId: number) =>
  useQuery({
    queryKey: ['screenshots', gameId],
    queryFn: () => screenshotsApiClient.getAll({}),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
```

### Query Key Strategies

```typescript
// Query keys for different data types
const queryKeys = {
  games: ['games'] as const,
  game: (slug: string) => ['games', slug] as const,
  gamesByQuery: (query: GameQuery) => ['games', query] as const,
  genres: ['genres'] as const,
  platforms: ['platforms'] as const,
  screenshots: (gameId: number) => ['screenshots', gameId] as const,
  trailers: (gameId: number) => ['trailers', gameId] as const,
};
```

## Caching Strategy

### React Query Configuration

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      cacheTime: 1000 * 60 * 10, // 10 minutes default
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### Cache Invalidation

```typescript
// Invalidate cache when needed
import { useQueryClient } from '@tanstack/react-query';

const useRefreshData = () => {
  const queryClient = useQueryClient();

  const refreshGames = () => {
    queryClient.invalidateQueries(['games']);
  };

  const refreshGame = (slug: string) => {
    queryClient.invalidateQueries(['games', slug]);
  };

  return { refreshGames, refreshGame };
};
```

### Prefetching

```typescript
// Prefetch related data
const useGamePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchGameDetails = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['games', slug],
      queryFn: () => apiClient.get(slug),
      staleTime: 1000 * 60 * 10,
    });
  };

  return { prefetchGameDetails };
};
```

## Error Handling

### API Error Types

```typescript
// types/errors.ts
export interface APIError {
  message: string;
  status: number;
  code?: string;
}

export class APIClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'APIClientError';
  }
}
```

### Error Handling in API Client

```typescript
// Enhanced API client with error handling
class APICLient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = async (config: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.get<FetcheResponse<T>>(
        this.endpoint, 
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new APIClientError(
          error.response?.data?.message || error.message,
          error.response?.status || 500,
          error.code
        );
      }
      throw error;
    }
  };

  get = async (id: number | string) => {
    try {
      const response = await axiosInstance.get<T>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new APIClientError('Resource not found', 404, 'NOT_FOUND');
        }
        throw new APIClientError(
          error.response?.data?.message || error.message,
          error.response?.status || 500,
          error.code
        );
      }
      throw error;
    }
  };
}
```

### Error Handling in Components

```typescript
const GameDetails = ({ slug }: { slug: string }) => {
  const { data: game, isLoading, error } = useGame(slug);

  if (isLoading) return <Spinner />;
  
  if (error) {
    if (error instanceof APIClientError) {
      if (error.status === 404) {
        return <NotFoundMessage />;
      }
      return <ErrorMessage message={error.message} />;
    }
    return <ErrorMessage message="An unexpected error occurred" />;
  }

  return <GameDetailsContent game={game} />;
};
```

## API Security

### API Key Management

```typescript
// Use environment variables for API keys
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || 'default-key';

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: API_KEY,
  },
});
```

### Environment Configuration

```bash
# .env.local
VITE_RAWG_API_KEY=your_actual_api_key_here
VITE_API_BASE_URL=https://api.rawg.io/api
```

### Request Interceptors

```typescript
// Add request interceptors for logging and auth
axiosInstance.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized API access');
    }
    return Promise.reject(error);
  }
);
```

## Rate Limiting

### RAWG API Limits

- **Free Tier**: 20,000 requests per month
- **Rate Limit**: Varies by endpoint
- **Best Practices**: Implement caching and request optimization

### Request Optimization

```typescript
// Optimize requests with proper caching
const useOptimizedGames = (gameQuery: GameQuery) => {
  return useInfiniteQuery({
    queryKey: ['games', gameQuery],
    queryFn: ({ pageParam = 1 }) => {
      // Only include non-empty parameters
      const params = Object.entries({
        genres: gameQuery.genreId,
        parent_platforms: gameQuery.platformId,
        ordering: gameQuery.sortOrder,
        search: gameQuery.searchText,
        page: pageParam,
        page_size: 20,
      }).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      return apiClient.getAll({ params });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.next ? true : undefined;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
```

### Debounced Search

```typescript
// Debounce search queries to reduce API calls
import { useDebouncedValue } from './useDebouncedValue';

const useGameSearch = (searchTerm: string) => {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  
  return useGames({ searchText: debouncedSearchTerm });
};
```

## Testing API Integration

### Mock API Responses

```typescript
// __mocks__/api-client.ts
export const mockGames = [
  {
    id: 1,
    name: 'Mock Game',
    slug: 'mock-game',
    background_image: 'mock-image.jpg',
    metacritic: 85,
    genres: [{ id: 1, name: 'Action' }],
    platforms: [{ platform: { id: 1, name: 'PC' } }],
  },
];

export const mockApiClient = {
  getAll: jest.fn().mockResolvedValue({
    count: 1,
    next: null,
    results: mockGames,
  }),
  get: jest.fn().mockResolvedValue(mockGames[0]),
};
```

### Integration Tests

```typescript
// tests/api/games.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGames from '../hooks/useGames';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('useGames fetches games successfully', async () => {
  const { result } = renderHook(() => useGames({}), {
    wrapper: createWrapper(),
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toBeDefined();
});
```

## Image Processing

### Image URL Optimization

```typescript
// services/image-url.ts
import noImage from "../assets/no-image-placeholder.webp";

const getCroppedImageUrl = (url: string) => {
  if (!url) return noImage;
  
  const target = 'media/';
  const index = url.indexOf(target) + target.length;
  
  // Add crop parameters for consistent image sizes
  return url.slice(0, index) + 'crop/600/400/' + url.slice(index);
};

export default getCroppedImageUrl;
```

### Responsive Images

```tsx
// components/GameImage.tsx
import { Image } from '@chakra-ui/react';
import getCroppedImageUrl from '../services/image-url';

interface GameImageProps {
  src: string;
  alt: string;
}

const GameImage = ({ src, alt }: GameImageProps) => (
  <Image
    src={getCroppedImageUrl(src)}
    alt={alt}
    loading="lazy"
    fallbackSrc="/assets/no-image-placeholder.webp"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);
```

## Performance Monitoring

### API Performance Tracking

```typescript
// utils/performance.ts
export const trackAPIPerformance = (endpoint: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (import.meta.env.DEV) {
    console.log(`API ${endpoint} took ${duration.toFixed(2)}ms`);
  }
  
  // Send to analytics service in production
  if (import.meta.env.PROD && duration > 1000) {
    // Track slow API calls
    console.warn(`Slow API call: ${endpoint} took ${duration}ms`);
  }
};
```

## Next Steps

- Review [Frontend Development Guide](FRONTEND.md)
- Check [Deployment Guide](DEPLOYMENT.md)
- Explore [Architecture Overview](ARCHITECTURE.md)