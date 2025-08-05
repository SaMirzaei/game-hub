# Beitragsrichtlinien

Willkommen bei Game Hub! Wir schätzen Ihr Interesse, zu diesem Projekt beizutragen. Dieses Handbuch hilft Ihnen beim Einstieg in Beiträge zur Codebasis.

## Inhaltsverzeichnis

- [Verhaltenskodex](#verhaltenskodex)
- [Erste Schritte](#erste-schritte)
- [Entwicklungsworkflow](#entwicklungsworkflow)
- [Coding-Standards](#coding-standards)
- [Commit-Richtlinien](#commit-richtlinien)
- [Pull Request-Prozess](#pull-request-prozess)
- [Problem-Meldung](#problem-meldung)
- [Test-Richtlinien](#test-richtlinien)
- [Dokumentations-Richtlinien](#dokumentations-richtlinien)
- [Review-Prozess](#review-prozess)

## Verhaltenskodex

### Unser Versprechen

Wir verpflichten uns, eine einladende und inklusive Umgebung für alle Mitwirkenden zu schaffen. Wir versprechen:

- Respektvoll und inklusiv in allen Interaktionen zu sein
- Neuankömmlinge willkommen zu heißen und ihnen beim Einstieg zu helfen
- Uns auf das zu konzentrieren, was für die Community am besten ist
- Empathie gegenüber anderen Community-Mitgliedern zu zeigen

### Erwartetes Verhalten

- Einladende und inklusive Sprache verwenden
- Respektvoll gegenüber unterschiedlichen Standpunkten und Erfahrungen sein
- Konstruktive Kritik würdevoll annehmen
- Sich auf das konzentrieren, was für die Community am besten ist
- Empathie gegenüber anderen Community-Mitgliedern zeigen

### Inakzeptables Verhalten

- Belästigung, Diskriminierung oder feindseliges Verhalten
- Trolling, beleidigende/abwertende Kommentare
- Öffentliche oder private Belästigung
- Veröffentlichung privater Informationen anderer ohne Erlaubnis
- Anderes Verhalten, das vernünftigerweise als unangemessen betrachtet werden könnte

## Erste Schritte

### Voraussetzungen

- Node.js 18 oder höher
- npm oder yarn Package Manager
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/game-hub.git
   cd game-hub
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/SaMirzaei/game-hub.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Verify setup**
   - Open `http://localhost:5173`
   - Ensure the application loads correctly

### Environment Setup

Create a `.env.local` file for development:

```bash
# RAWG API key (get from https://rawg.io/apidocs)
VITE_RAWG_API_KEY=your_api_key_here
```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch (if applicable)
- `feature/feature-name`: New features
- `bugfix/issue-description`: Bug fixes
- `docs/documentation-updates`: Documentation changes

### Feature Development

1. **Create a new branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Write tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run preview
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Update your main branch
git checkout main
git merge upstream/main

# Update your feature branch (if needed)
git checkout feature/your-feature-name
git rebase main
```

## Coding Standards

### TypeScript Guidelines

1. **Use TypeScript strictly**
   ```typescript
   // ✅ Good - Explicit types
   interface GameCardProps {
     game: Game;
     onSelect?: (game: Game) => void;
   }

   // ❌ Avoid - Any types
   const handleClick = (data: any) => { ... }
   ```

2. **Interface naming**
   ```typescript
   // ✅ Good
   interface User {
     id: number;
     name: string;
   }

   // ❌ Avoid
   interface IUser { ... }
   interface UserInterface { ... }
   ```

3. **Component props**
   ```typescript
   // ✅ Good - Define props interface
   interface ButtonProps {
     label: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary';
   }

   const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
     // Component implementation
   };
   ```

### React Guidelines

1. **Functional components with hooks**
   ```typescript
   // ✅ Good
   const GameCard = ({ game }: { game: Game }) => {
     const [isLoading, setIsLoading] = useState(false);
     
     return (
       <Card>
         {/* Component JSX */}
       </Card>
     );
   };

   // ❌ Avoid class components (unless necessary)
   class GameCard extends React.Component { ... }
   ```

2. **Custom hooks for logic**
   ```typescript
   // ✅ Good - Extract logic to custom hooks
   const useGameDetails = (gameId: number) => {
     const [game, setGame] = useState<Game | null>(null);
     const [loading, setLoading] = useState(true);

     // Hook logic
     return { game, loading };
   };
   ```

3. **Component composition**
   ```typescript
   // ✅ Good - Small, focused components
   const GameCard = ({ game }: GameCardProps) => (
     <Card>
       <GameImage src={game.background_image} alt={game.name} />
       <GameTitle>{game.name}</GameTitle>
       <GameRating rating={game.metacritic} />
     </Card>
   );
   ```

### File Organization

```
src/
├── components/
│   ├── GameCard/
│   │   ├── GameCard.tsx
│   │   ├── GameCard.test.tsx
│   │   └── index.ts
│   └── index.ts (barrel exports)
├── hooks/
│   ├── useGames.ts
│   └── useGame.ts
├── types/
│   ├── Game.ts
│   └── index.ts
└── utils/
    ├── api.ts
    └── helpers.ts
```

### Naming Conventions

- **Components**: PascalCase (`GameCard`, `SearchInput`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase (`gameData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Functions**: camelCase (`fetchGames`, `handleClick`)

### CSS/Styling Guidelines

1. **Use Chakra UI components**
   ```typescript
   // ✅ Good - Use Chakra UI
   <Box p={4} bg="gray.100" borderRadius="md">
     <Text fontSize="lg">{game.name}</Text>
   </Box>

   // ❌ Avoid custom CSS unless necessary
   <div className="custom-card">
     <span className="game-title">{game.name}</span>
   </div>
   ```

2. **Responsive design**
   ```typescript
   <Grid
     templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
     gap={6}
   >
     {/* Grid items */}
   </Grid>
   ```

## Commit Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
# Good commit messages
feat(games): add infinite scroll to games list
fix(search): resolve search input clearing issue
docs(readme): update installation instructions
refactor(api): extract common API logic to service layer

# Avoid
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "WIP"
```

### Commit Best Practices

1. **Make atomic commits** - Each commit should represent a single logical change
2. **Write descriptive messages** - Explain what and why, not just what
3. **Keep commits focused** - Don't mix unrelated changes
4. **Test before committing** - Ensure your code works

## Pull Request Process

### Before Creating a PR

1. **Ensure your branch is up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run build
   npm run test # when tests are available
   ```

3. **Test manually**
   - Test your changes in the browser
   - Verify no regressions
   - Check responsive design

### PR Title and Description

**Title Format**: `type(scope): description`

**Description Template**:
```markdown
## What
Brief description of changes

## Why
Explanation of why this change is needed

## How
Technical details of implementation

## Testing
- [ ] Manual testing completed
- [ ] No regressions found
- [ ] Responsive design verified

## Screenshots
(If applicable)

Fixes #issue_number
```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
- [ ] No console errors or warnings
- [ ] Build passes successfully
- [ ] Responsive design tested
- [ ] Accessible design considered

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: [e.g., Chrome 96]
- Device: [e.g., iPhone 12]
- OS: [e.g., macOS 12.0]

**Screenshots**
If applicable, add screenshots
```

### Feature Requests

```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## Testing Guidelines

### Manual Testing

1. **Browser Compatibility**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

2. **Device Testing**
   - Desktop (1920x1080+)
   - Tablet (768px - 1024px)
   - Mobile (320px - 767px)

3. **Functionality Testing**
   - Search functionality
   - Filter and sort options
   - Game details navigation
   - Theme switching
   - Infinite scroll

### Accessibility Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Ensure focus indicators are visible
   - Test keyboard shortcuts

2. **Screen Reader Testing**
   - Use tools like NVDA or VoiceOver
   - Ensure proper ARIA labels
   - Test with images disabled

3. **Color Contrast**
   - Use tools like WebAIM Contrast Checker
   - Ensure WCAG AA compliance
   - Test both light and dark themes

## Documentation Guidelines

### Code Documentation

1. **Component Documentation**
   ```typescript
   /**
    * Game card component displaying game information
    * @param game - Game object containing game details
    * @param onSelect - Optional callback when game is selected
    */
   interface GameCardProps {
     game: Game;
     onSelect?: (game: Game) => void;
   }
   ```

2. **Function Documentation**
   ```typescript
   /**
    * Formats game rating as percentage
    * @param rating - Numeric rating (0-100)
    * @returns Formatted rating string
    */
   const formatRating = (rating: number): string => {
     return `${rating}%`;
   };
   ```

### README Updates

When adding features that affect:
- Installation process
- Configuration
- Usage instructions
- Dependencies

Update the main README.md accordingly.

### API Documentation

When modifying API integration:
- Update `docs/API.md`
- Document new endpoints
- Update type definitions
- Add usage examples

## Review Process

### Review Criteria

Reviewers will check for:

1. **Code Quality**
   - Follows coding standards
   - Proper TypeScript usage
   - No code smells or anti-patterns

2. **Functionality**
   - Features work as expected
   - No regressions introduced
   - Error handling implemented

3. **Performance**
   - No unnecessary re-renders
   - Efficient data fetching
   - Proper caching

4. **Accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

5. **Documentation**
   - Code comments where needed
   - README updates if applicable
   - Type definitions complete

### Addressing Review Comments

1. **Make requested changes**
2. **Respond to comments** - Explain your approach if needed
3. **Push additional commits** - Don't squash until approved
4. **Request re-review** when ready

### Merging

- PRs require at least one approval
- All CI checks must pass
- Branch must be up to date with main
- Squash and merge preferred for feature branches

## Getting Help

### Community Support

- **GitHub Discussions**: For general questions and discussions
- **Issues**: For bug reports and feature requests
- **Discord/Slack**: Community chat (if available)

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
- [Vite Documentation](https://vitejs.dev/)

### Project-Specific Resources

- [Frontend Development Guide](FRONTEND.md)
- [API Integration Guide](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Overview](ARCHITECTURE.md)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project README
- Release notes (for significant contributions)

Thank you for contributing to Game Hub! 🎮✨