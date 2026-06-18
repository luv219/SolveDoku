# SolveDoku Deployment

## Local Setup

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

None required.

SolveDoku is frontend-only and does not require backend services, database credentials, or API keys.

## Vercel Deployment

1. Push the repository to GitHub.
2. Create a new Vercel project.
3. Import the repository.
4. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

## GitHub Pages Notes

For GitHub Pages, configure Vite `base` if deploying under a repository subpath.

Example:

```ts
export default defineConfig({
  base: "/SolveDoku/",
  plugins: [react()],
});
```

Then build and publish the `dist` directory.

## Troubleshooting

- Build fails with TypeScript errors: run `npm run build` locally and fix the reported file and line.
- Routes fail after static deploy: ensure the host is configured for SPA fallback to `index.html`.
- Blank page on GitHub Pages: check whether `base` needs to match the repository path.
- Old Play state behaves oddly: use Clear Saved Game on the Play page, or clear the browser’s localStorage for the site.
- Dark mode preference seems stuck: toggle theme in the navbar or clear `solvedoku-theme` from localStorage.
