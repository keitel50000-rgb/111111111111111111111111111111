export function Navbar(){
  return `
  <nav class="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
    <div class="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
      <a href="#/" class="font-bold text-xl">Rick & Morty SPA</a>
      <div class="space-x-4">
        <a class="hover:underline" href="#/">Inicio</a>
        <a class="hover:underline" href="#/catalogo">Catálogo</a>
      </div>
    </div>
  </nav>
  `
}

