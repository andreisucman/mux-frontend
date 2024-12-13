# muxout frontend

# Paths

/chat, // p
/advisor, // p
/results, // p
/results/styles, // p
/results/proof, // p
/tasks, // p
/tasks/history, // p
/tasks/calendar, // p
/products, // p
/explain, // p
/upload-proof, // p
/sort-concerns // p
/considerations // p
/analysis, // p,
/analysis/style, // p
/club, // p - club profile
/club/join, // p
/club/registraion, // p
/club/progress, // progress of a user from club
/club/styles, // styles of a user from club
/club/proof, // proof of a user from club
/club/about,
/club/routines,
/, // before afters from club
/style, // styles from club
/proof, // proof from club
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
