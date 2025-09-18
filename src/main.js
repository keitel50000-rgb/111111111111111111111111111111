import Navbar from './components/Navbar.js'
import router from './router.js'
import './styles.css'

const app=document.getElementById('app');
app.innerHTML = `
  <div id="root">
    <header id="nav"></header>
    <main id="view"></main>
  </div>
`;

const nav = Navbar(); document.getElementById('nav').appendChild(nav);
router();
