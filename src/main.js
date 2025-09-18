import Navbar from './components/Navbar.js'
import router from './router.js'
import './styles.css'

const app=document.getElementById('app');
window.addEventListener('error', e => { app.insertAdjacentHTML('beforeend', `<pre style="color:red">JS error: ${e.message}</pre>`); });
app.innerHTML = `
  <div id="root">
    <header id="nav"></header>
    <main id="view">
      <h1 class="text-3xl font-bold text-center mt-8">Rick & Morty SPA</h1>
      <p class="text-center">Cargando…</p>
    </main>
  </div>
`;

try{
  const nav = Navbar(); document.getElementById('nav').appendChild(nav);
  router();
}catch(e){ console.error(e); app.insertAdjacentHTML('beforeend', `<pre style="color:red">Init error: ${e.message}</pre>`); }
