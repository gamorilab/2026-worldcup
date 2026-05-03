## World Cup 2026 Schedule

Localized World Cup schedule focused on Brazil-time visibility, with:

- i18n routes (`pt-BR`, `en-US`, `es-ES`)
- localized date/time formatting
- grouped country filtering and local flag assets
- mobile-friendly navigation across competition phases

## Requirements

- Node.js `>=20.9.0`
- npm `>=10`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and Validate

```bash
npm run lint
npm run build
```

## Flags Assets

Download/update local country flags:

```bash
npm run flags:fetch
```

Flags are stored in `public/flags`.

## Deploy to Vercel

1. Import this repository in Vercel.
2. Framework preset: `Next.js` (also declared in `vercel.json`).
3. Build command: `npm run build`.
4. Output directory: `.next`.
5. Deploy.

No additional environment variables are required for the base experience.
