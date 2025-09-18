import Home from './pages/Home.js'
import Catalog from './pages/Catalog.js'
import Detail from './pages/Detail.js'

export function navigate(path){ location.hash = '#' + path }
export function router(){
  const view = document.getElementById('view')
  const [path, q] = (location.hash.slice(1) || '/').split('?')
  const params = new URLSearchParams(q || '')
  const routes = {'/':Home,'/catalogo':Catalog,'/detalle':Detail}
  const Page = routes[path] || (()=>'<div class="py-10">Ruta no encontrada</div>')
  view.innerHTML = Page({ params })
}
