# Rick & Morty Catalog — SPA con IA (Vite + Tailwind + Fetch + TensorFlow.js)

SPA ligera con rutas (Inicio, Catálogo, Detalle), API Rick & Morty, favoritos, filtro por episodio, scroll infinito y análisis de texto con TensorFlow.js (toxicity).

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## GitHub Pages
- `vite.config.js` usa `base: '/rick-and-morty-catalog555555555555/'`
- Workflow en `.github/workflows/deploy.yml`

## Vercel
- Cambia `base: '/'` y despliega (Build: `npm run build`, Output: `dist`).
