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
