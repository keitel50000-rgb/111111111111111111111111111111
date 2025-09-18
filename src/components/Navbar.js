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
