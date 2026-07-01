# Contributing to Nudum

Thank you for contributing to Nudum! As an enterprise-grade modular SaaS platform, we follow strict development and design standards.

## Code of Conduct

We expect all contributors to adhere to the standards outlined in our `CODE_OF_CONDUCT.md`.

## Mandatory Reading

Before making any changes or submitting pull requests, you must read:

1. `AGENTS.md` - Primary development rules.
2. `docs/03-domain/ubiquitous-language.md` - Strictly canonical naming glossary. No synonyms allowed.
3. `docs/04-architecture/system-architecture.md` - Architectural principles.

## Development Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run development servers:
   ```bash
   pnpm run dev
   ```
3. Run linting & formatting checks:
   ```bash
   pnpm run lint
   pnpm run build
   ```

## Commit Guidelines

All commits must follow the **Conventional Commits** specification:

- `feat`: A new user-facing feature.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `style`: Changes that do not affect code logic (formatting, whitespace).
- `refactor`: Code restructuring without bug fixes or new features.
- `test`: Adding or modifying tests.
- `chore`: Infrastructure, build configuration, or package dependencies updates.

Example:

```bash
feat(mahattati): add equipment validation service
```

## Pull Request Guidelines

1. Create a branch from `main` named after the issue (e.g. `feat/issue-number-description`).
2. Implement your changes following DDD and modular monolith boundaries.
3. Verify that types compile, tests run, and linting passes.
4. Open a Pull Request extending our pull request template.
