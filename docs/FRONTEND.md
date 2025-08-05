# Frontend-Entwicklungshandbuch

Dieses Handbuch bietet umfassende Informationen für die Frontend-Entwicklung der Game Hub-Anwendung.

## Inhaltsverzeichnis

- [Projektstruktur](#projektstruktur)
- [Entwicklungssetup](#entwicklungssetup)
- [Architektur-Übersicht](#architektur-übersicht)
- [Komponenten-Richtlinien](#komponenten-richtlinien)
- [Styling mit Chakra UI](#styling-mit-chakra-ui)
- [State Management](#state-management)
- [Data Fetching](#data-fetching)
- [Routing](#routing)
- [Type Safety](#type-safety)
- [Performance-Überlegungen](#performance-überlegungen)
- [Build-Prozess](#build-prozess)
- [Fehlerbehebung](#fehlerbehebung)

## Projektstruktur

```
src/
├── assets/              # Statische Assets (Bilder, Icons)
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── ui/             # Basis-UI-Provider-Komponenten
│   └── *.tsx           # Feature-spezifische Komponenten
├── data/               # Statische Daten und Konstanten
├── entities/           # TypeScript-Typdefinitionen
├── hooks/              # Benutzerdefinierte React Hooks
├── pages/              # Seitenkomponenten
├── services/           # API-Clients und externe Services
├── routes.tsx          # Anwendungsrouting-Konfiguration
├── store.ts            # Globales State Management
├── theme.ts            # Chakra UI Theme-Konfiguration
├── index.css           # Globale Styles
└── main.tsx            # Anwendungseinstiegspunkt
```

## Entwicklungssetup

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn Package Manager
- Git

### Umgebungssetup

1. **Repository klonen**
   ```bash
   git clone https://github.com/SaMirzaei/game-hub.git
   cd game-hub
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Browser öffnen**
   Navigieren Sie zu `http://localhost:5173`

### Entwicklungsscripts

| Befehl | Beschreibung |
|---------|-------------|
| `npm run dev` | Entwicklungsserver mit Hot Reload starten |
| `npm run build` | Produktionsfertiges Bundle erstellen |
| `npm run preview` | Produktions-Build lokal vorschauen |
| `npm run lint` | ESLint für Code-Qualitätsprüfungen ausführen |

## Architektur-Übersicht

### Technologie-Stack

- **React 19**: Neueste Version mit verbesserten Concurrent-Features
- **TypeScript**: Typsichere JavaScript-Entwicklung
- **Vite**: Schnelles Build-Tool und Entwicklungsserver
- **Chakra UI v3**: Moderne React-Komponenten-Bibliothek
- **TanStack Query**: Server State Management und Caching
- **Zustand**: Leichtgewichtiges Client State Management
- **React Router DOM**: Deklaratives Routing

### Wichtige Design-Patterns

1. **Komponenten-Komposition**: Kleine, wiederverwendbare Komponenten
2. **Custom Hooks**: Geschäftslogik-Trennung
3. **Service Layer**: API-Abstraktion
4. **Type Safety**: Umfassende TypeScript-Nutzung

## Komponenten-Richtlinien

### Komponenten-Struktur

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

1. **Funktionale Komponenten verwenden** mit Hooks
2. **Props-Interface** sollte explizit definiert werden
3. **Default Exports** für Komponenten
4. **Beschreibende Namen** nach PascalCase
5. **Kleine Komponenten komponieren** anstatt große

### Komponenten-Kategorien

- **Pages**: Route-Level-Komponenten (`HomePage`, `GameDetailsPage`)
- **Layout**: Strukturkomponenten (`Layout`, `NavBar`)
- **UI**: Wiederverwendbare Interface-Elemente (`GameCard`, `CriticScore`)
- **Form**: Input- und Form-bezogene Komponenten

## Styling mit Chakra UI

### Theme-Konfiguration

Die Anwendung verwendet ein benutzerdefiniertes Chakra UI Theme, definiert in `src/theme.ts`:

```typescript
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const theme = createSystem(defaultConfig, {
  // Benutzerdefinierte Theme-Konfiguration
})
```

### Komponenten-Styling

```tsx
import { Box, Text } from '@chakra-ui/react';

const StyledComponent = () => (
  <Box
    p={4}              // padding: 1rem
    bg="gray.100"      // Hintergrundfarbe
    borderRadius="md"  // Border Radius
  >
    <Text fontSize="lg" fontWeight="bold">
      Gestylter Text
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
  Responsive Inhalte
</Box>
```

### Dark Mode-Unterstützung

Die App enthält Theme-Switching-Funktionalität:

```tsx
import { useColorMode } from '@chakra-ui/react';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Dunkler' : 'Heller'} Modus
    </Button>
  );
};
```

## State Management

### Zustand Store

Globaler State wird mit Zustand in `src/store.ts` verwaltet:

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
  // ... andere Setter
}));
```

### Verwendung in Komponenten

```tsx
import useGameQueryStore from '../store';

const SearchComponent = () => {
  const { gameQuery, setSearchText } = useGameQueryStore();
  
  return (
    <Input
      value={gameQuery.searchText || ''}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Spiele suchen..."
    />
  );
};
```

## Data Fetching

### TanStack Query Setup

Data Fetching verwendet TanStack Query für Caching und Synchronisation:

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

// Verwendung in Komponente
const GameDetails = ({ slug }: { slug: string }) => {
  const { data: game, isLoading, error } = useGame(slug);
  
  if (isLoading) return <Spinner />;
  if (error) return <Text>Fehler beim Laden des Spiels</Text>;
  
  return <div>{game?.name}</div>;
};
```

## Routing

### Route-Konfiguration

Routen sind in `src/routes.tsx` definiert:

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

### Entity-Definitionen

Typen sind in `src/entities/` definiert:

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

### API-Response-Typen

```typescript
export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}
```

## Performance-Überlegungen

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

const GameDetailsPage = lazy(() => import('./pages/GameDetailsPage'));

// Verwendung mit Suspense
<Suspense fallback={<Spinner />}>
  <GameDetailsPage />
</Suspense>
```

### Bild-Optimierung

```tsx
// services/image-url.ts
const getCroppedImageUrl = (url: string) => {
  if (!url) return noImage;
  
  const target = 'media/';
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + 'crop/600/400/' + url.slice(index);
};
```

### Unendliches Scrollen

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
      {/* Spiele-Karten */}
    </InfiniteScroll>
  );
};
```

## Build-Prozess

### Entwicklungs-Build

```bash
npm run dev
```

Funktionen:
- Hot Module Replacement (HMR)
- Source Maps
- Fast Refresh
- Entwicklungsserver auf `localhost:5173`

### Produktions-Build

```bash
npm run build
```

Ausgabe:
- Optimiertes Bundle im `dist/` Verzeichnis
- Code Splitting
- Asset-Optimierung
- Tree Shaking

### Build-Analyse

```bash
npm run build -- --analyze
```

### Umgebungsvariablen

Erstellen Sie `.env.local` für lokale Entwicklung:

```env
VITE_API_KEY=your_rawg_api_key
VITE_API_BASE_URL=https://api.rawg.io/api
```

## Fehlerbehebung

### Häufige Probleme

1. **Port bereits in Verwendung**
   ```bash
   # Prozess auf Port 5173 beenden
   lsof -ti:5173 | xargs kill -9
   ```

2. **Node modules Probleme**
   ```bash
   # Cache löschen und neu installieren
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript-Fehler**
   ```bash
   # TypeScript-Konfiguration überprüfen
   npx tsc --noEmit
   ```

4. **Build-Fehler**
   ```bash
   # Vite-Cache löschen
   npx vite --force
   ```

### Entwicklungstools

- **React Developer Tools**: Browser-Erweiterung für React-Debugging
- **React Query Devtools**: Eingebaute Query-Inspektion (in Entwicklung aktiviert)
- **ESLint**: Code-Qualitäts- und Stilprüfung
- **TypeScript**: Compile-Time-Typprüfung

### Performance-Monitoring

```tsx
// Performance-Monitoring hinzufügen
if (import.meta.env.DEV) {
  // Nur für Entwicklung
  console.log('Performance-Metriken:', performance.timing);
}
```

## Nächste Schritte

- Erkunden Sie das [API-Integrationshandbuch](API.md)
- Überprüfen Sie die [Architektur-Übersicht](ARCHITECTURE.md)
- Lesen Sie die [Beitragsrichtlinien](CONTRIBUTING.md)