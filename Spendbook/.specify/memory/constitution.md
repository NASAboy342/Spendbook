# Spendbook Constitution

## Core Principles

### I. Vue 3 Composition API
- All components must use the Composition API with `<script setup>` syntax
- No Options API allowed
- Use `ref`, `reactive`, `computed`, `watch`, and other composition functions
- Organize logic into reusable composables for shared functionality

### II. TypeScript Strict Mode (NON-NEGOTIABLE)
- TypeScript strict mode must remain enabled at all times
- All code must have proper type annotations
- No `any` types unless absolutely necessary and documented
- Interfaces and types must be defined for all props, emits, and composable return values
- Prefer `type` over `interface` unless extending is required

### III. Composables Pattern
- Extract reusable logic into composables (files prefixed with `use`, e.g., `useSpendbook.ts`)
- Composables must be placed in `src/composables/` directory
- Each composable should have a single, clear responsibility
- Composables must return typed objects with clear API surfaces
- Document composable purpose and usage with JSDoc comments

### IV. DaisyUI Component Library
- Use DaisyUI components exclusively for UI elements (btn, card, dropdown, checkbox, modal, drawer, etc.)
- Do not create custom implementations of components that DaisyUI provides
- Follow DaisyUI naming conventions for classes and variants
- Leverage DaisyUI themes for consistent styling
- Combine DaisyUI with Tailwind utility classes for layout and spacing

### V. No Testing Infrastructure
- No unit tests, integration tests, or E2E tests required
- No testing frameworks (Vitest, Jest, Playwright, Cypress, etc.) should be added
- Focus on runtime functionality and user experience
- Manual testing and validation is acceptable

## Technology Stack

### Required Stack
- **Framework**: Vue 3 (latest stable)
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + DaisyUI
- **API Style**: Composition API with `<script setup>`

### File Structure Conventions
```
src/
  ├── components/        # Vue components
  ├── composables/       # Reusable composition functions
  ├── types/            # TypeScript type definitions
  ├── assets/           # Static assets
  ├── views/            # Page-level components (if using router)
  └── App.vue           # Root component
```

### Component Guidelines
- Keep components focused and single-purpose
- Use props for input, emits for output
- Define props and emits with TypeScript types
- Extract complex logic into composables
- Prefer functional composition over component inheritance

## Code Quality Standards

### TypeScript
- Enable all strict mode flags in `tsconfig.json`
- Use explicit return types for functions
- Leverage TypeScript utility types (`Partial`, `Pick`, `Omit`, etc.)
- Define types close to their usage

### Vue Best Practices
- Use `defineProps` and `defineEmits` with TypeScript syntax
- Destructure props carefully (use `toRefs` or `toRef` when needed)
- Keep template logic simple, move complexity to composables
- Use `v-if` for conditional rendering, `v-show` for toggling visibility

### Styling
- Use Tailwind utility classes for layout and spacing
- Use DaisyUI component classes for UI elements
- Avoid custom CSS unless absolutely necessary
- Follow mobile-first responsive design principles

## Development Workflow

### Feature Development
1. Plan component structure and identify composables
2. Define TypeScript types/interfaces first
3. Implement composables with typed return values
4. Build components using DaisyUI components
5. Apply Tailwind utilities for layout
6. Verify TypeScript compilation passes with no errors

### Code Review Focus
- TypeScript strict mode compliance
- Proper use of Composition API patterns
- Appropriate use of DaisyUI components
- Composable extraction for reusable logic
- No custom implementations of existing DaisyUI components

## Governance

This constitution defines the non-negotiable standards for the Spendbook project. All code must comply with these principles:

- **Composition API only**: No Options API code will be accepted
- **TypeScript strict mode**: Cannot be disabled
- **No testing**: Testing infrastructure is explicitly excluded
- **DaisyUI first**: Use DaisyUI components before building custom UI
- **Composables for logic**: Extract shared logic into composables

**Version**: 1.0.0 | **Ratified**: 2025-12-08 | **Last Amended**: 2025-12-08
