import { Navbar } from './components/Navbar.js'
import { router } from './router.js'
import './styles.css'

const app = document.getElementById('app')
app.innerHTML = `${Navbar()}<main id="view" class="max-w-5xl mx-auto px-4 py-6"></main>`
if(!location.hash) location.hash = '#/'
router()
