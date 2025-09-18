import { debounce } from '../utils/storage.js'
import { store } from '../utils/storage.js'

const API_BASE = 'https://rickandmortyapi.com/api'

export async function Catalog(){
  return `
  <div class="max-w-5xl mx-auto px-4 py-6">
    <div class="flex gap-2 mb-4">
      <input id="search" placeholder="Buscar por nombre..." class="w-full rounded-lg border px-3 py-2" />
      <select id="episode" class="rounded-lg border px-3 py-2"><option value="">Todos los episodios</option></select>
      <label class="flex items-center gap-2"><input type="checkbox" id="only-favs"> Solo favoritos</label>
    </div>
    <div id="grid" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
    <div id="loading" class="py-6 text-center"></div>
  </div>`
}

// state
let state = { query:'', page:1, next:null, favs:new Set(store.get('rm-favs', [])), episode:'' }

async function fetchEpisodes(){
  const res = await fetch(API_BASE + '/episode')
  const json = await res.json()
  const sel = document.getElementById('episode')
  if(!sel) return
  json.results.forEach(e=>{
    const opt = document.createElement('option')
    opt.value = e.id
    opt.textContent = `${e.episode} — ${e.name}`
    sel.appendChild(opt)
  })
}

function renderChars(items){
  const grid = document.getElementById('grid')
  if(state.page === 1) grid.innerHTML = ''
  items.forEach(it=>{
    const div = document.createElement('div')
    div.className = 'bg-white rounded-2xl shadow-sm p-3 border'
    div.innerHTML = `
      <img src="${it.image}" class="w-full rounded-lg mb-2" />
      <h3 class="font-semibold">${it.name}</h3>
      <p class="text-sm text-zinc-600">${it.species} — ${it.status}</p>
      <div class="mt-3 flex gap-2">
        <button data-id="${it.id}" class="fav-btn border rounded-lg px-3 py-1">${state.favs.has(it.id)?'★ Quitar':'☆ Favorito'}</button>
        <a href="#/detalle?id=${it.id}" class="ml-auto rounded-lg px-3 py-1 border hover:bg-zinc-50">Ver detalle</a>
      </div>
    `
    grid.appendChild(div)
  })
  attachFavs()
}

function attachFavs(){
  document.querySelectorAll('.fav-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const id = Number(btn.dataset.id)
      if(state.favs.has(id)){ state.favs.delete(id); btn.textContent='☆ Favorito' }
      else { state.favs.add(id); btn.textContent='★ Quitar' }
      store.set('rm-favs', Array.from(state.favs))
    }
  })
}

async function fetchChars(){
  const grid = document.getElementById('grid')
  const loading = document.getElementById('loading')
  loading.textContent = 'Cargando...'
  let url = `${API_BASE}/character/?page=${state.page}`
  if(state.query) url = `${API_BASE}/character/?name=${encodeURIComponent(state.query)}&page=${state.page}`
  // if episode filter
  if(state.episode){
    const res = await fetch(`${API_BASE}/episode/${state.episode}`)
    const ep = await res.json()
    const ids = ep.characters.map(u=>u.split('/').pop())
    const slice = ids.slice((state.page-1)*20, state.page*20)
    const resp = await fetch(`${API_BASE}/character/${slice.join(',')}`)
    const data = await resp.json()
    renderChars(Array.isArray(data)?data:[data])
    loading.textContent=''
    return
  }
  try{
    const res = await fetch(url)
    const json = await res.json()
    renderChars(json.results || [])
    state.next = json.info && json.info.next
  }catch(e){
    grid.innerHTML = `<div class="col-span-full text-center text-zinc-600">No hay resultados</div>`
  }
  loading.textContent = ''
}

// bindings after render
setTimeout(()=>{
  const search = document.getElementById('search')
  const only = document.getElementById('only-favs')
  const ep = document.getElementById('episode')
  fetchEpisodes()
  fetchChars()
  if(search) search.addEventListener('input', debounce((e)=>{ state.query = e.target.value; state.page=1; fetchChars() }, 400))
  if(ep) ep.addEventListener('change', (e)=>{ state.episode = e.target.value; state.page=1; fetchChars() })
  if(only) only.addEventListener('change', (e)=>{ if(e.target.checked){ // show favs
      const ids = Array.from(state.favs)
      if(ids.length===0){ document.getElementById('grid').innerHTML='<div class="col-span-full text-center">No favoritos</div>'; return }
      fetch(`${API_BASE}/character/${ids.join(',')}`).then(r=>r.json()).then(d=>{ renderChars(Array.isArray(d)?d:[d]) })
    } else { state.page=1; fetchChars() } })

  // infinite scroll
  window.addEventListener('scroll', ()=>{
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.85){
      if(state.next && !document.getElementById('loading').textContent){ state.page++; fetchChars() }
    }
  })
}, 60)

