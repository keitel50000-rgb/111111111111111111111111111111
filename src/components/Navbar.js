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
export default function Navbar(){
  const el=document.createElement('nav');
  el.className='nav container flex items-center justify-between';
  el.innerHTML=`
    <div class="flex items-center gap-4">
      <a href="#/" class="font-bold">Rick & Morty SPA</a>
      <a href="#/" class="ml-4 text-sm">Inicio</a>
      <a href="#/catalogo" class="ml-2 text-sm">Catálogo</a>
    </div>
  `;
  return el;
}
