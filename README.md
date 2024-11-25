# Max You Out frontend

# Paths

/chat, // p
/advisor, // p
/progress, // p
/styles, // p
/routines, // p
/routines/history, // p
/routeines/calendar, // p
/routines/products, // p
/explain, // p
/proof, // p
/proof/upload, // p
/analysis, // p,
/analysis/style, // p
/club, // p - club profile
/club/join, // p
/club/registraion, // p
/sort-concerns // p
/considerations // p
/club/progress,
/club/styles,
/club/proof,
/club/about,
/club/routines,
/, // before afters from club
/results/style, // styles from club
/results/proof, // proof from club
/reviews,
/solutions,
/rewards,
/settings,
/scan,
/plans,
/legal/terms,
/legal/privacy,
/legal/club,
/auth,

// p - protected

# Twin jsx

/progress - /club/progress
/styles - /club/styles - /results/style
/proof - /club/proof - /results/proof

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
