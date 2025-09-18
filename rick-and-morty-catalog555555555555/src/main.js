import './styles.css'
import { router, navigate } from './router.js'
import Navbar from './components/Navbar.js'

const app = document.getElementById('app')
function render(){
  app.innerHTML = `${Navbar()}<main id="view" class="container py-6"></main>
  <footer class="container py-10 text-sm text-slate-400">
    <hr class="border-slate-800 mb-6"/>
    <p>SPA con IA · Vite + Tailwind + TensorFlow.js · Rick & Morty API</p>
  </footer>`
  router()
}
window.addEventListener('hashchange', router)
window.addEventListener('load', ()=>{ render(); if(!location.hash) navigate('/') })
