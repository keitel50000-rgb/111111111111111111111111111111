export default function Navbar(){
  const links=[{href:'#/',label:'Inicio'},{href:'#/catalogo',label:'Catálogo'}]
  return `<header class="bg-slate-950/70 sticky top-0 backdrop-blur z-50 border-b border-slate-900">
    <div class="container flex items-center justify-between py-4">
      <a href="#/" class="text-lg font-bold">AI·SPA</a>
      <nav class="flex items-center gap-6">${links.map(l=>`<a href="${l.href}" class="text-slate-300">${l.label}</a>`).join('')}</nav>
    </div>
  </header>`
}
