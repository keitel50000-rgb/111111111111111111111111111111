import { Home } from './pages/Home.js'
import { Catalog } from './pages/Catalog.js'
import { Detail } from './pages/Detail.js'

async function render(componentFn){
  const view = document.getElementById('view')
  view.innerHTML = '<div class="py-8">Cargando...</div>'
  try {
    view.innerHTML = await componentFn()
  } catch(e){
    view.innerHTML = `<pre class="text-red-600">Error: ${e.message}</pre>`
  }
}

export async function router(){
  const hash = location.hash || '#/'
  const [path, qs] = hash.split('?')
  const params = new URLSearchParams(qs || '')
  if(path === '#/' ) return render(Home)
  if(path === '#/catalogo') return render(Catalog)
  if(path === '#/detalle') return render(() => Detail({ params }))
  // fallback
  const view = document.getElementById('view')
  view.innerHTML = `<div class="py-8 text-center">Página no encontrada</div>`
}

window.addEventListener('hashchange', router)
import Home from './pages/Home.js'
import Catalog from './pages/Catalog.js'
import Detail from './pages/Detail.js'

const routes={
  '':Home,
  '#/':Home,
  '#/catalogo':Catalog,
  '#/detalle':Detail
}

export default function router(){
  const view=document.getElementById('view');
  function render(){
    const hash=location.hash.split('?')[0] || '#/';
    const Page = routes[hash] || Home;
    view.innerHTML='';
    const pageEl = Page();
    view.appendChild(pageEl);
  }
  window.addEventListener('hashchange',render);
  if(!location.hash) location.hash='#/';
  render();
}
