import { debounce, } from '../utils/storage.js'
import { store } from '../utils/storage.js'

const API_BASE = 'https://rickandmortyapi.com/api'

export async function Catalog(){
  return `<div class="max-w-5xl mx-auto px-4 py-6">
    <div class="flex gap-2 mb-4">
      <input id="search" placeholder="Buscar por nombre..." class="w-full rounded-lg border px-3 py-2" />
      <select id="episode" class="rounded-lg border px-3 py-2"><option value="">Todos los episodios</option></select>
      <label class="flex items-center gap-2"><input type="checkbox" id="only-favs"> Solo favoritos</label>
    </div>
    <div id="grid" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
    <div id="loading" class="py-6 text-center"></div>
  </div>`
}

// basic state in module
let state = { query:'', page:1, results:[], next:null, favs:new Set(store.get('rm-favs', [])), episode:'' }

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

async function fetchChars(){
  const grid = document.getElementById('grid')
  const loading = document.getElementById('loading')
  loading.textContent = 'Cargando...'
  let url = `${API_BASE}/character/?page=${state.page}`
  if(state.query) url = `${API}/character/?name=${encodeURIComponent(state.query)}&page=${state.page}`
  // if episode filter
  if(state.episode){
    // fetch episode to get character ids
  const res = await fetch(`${API_BASE}/episode/${state.episode}`)
    const ep = await res.json()
    const ids = ep.characters.map(u=>u.split('/').pop())
    // paginate ids
    const slice = ids.slice((state.page-1)*20, state.page*20)
  const resp = await fetch(`${API_BASE}/character/${slice.join(',')}`)
    const data = await resp.json()
    return renderChars(Array.isArray(data)?data:[data])
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

// init bindings after render
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
      fetch(`${API}/character/${ids.join(',')}`).then(r=>r.json()).then(d=>{ renderChars(Array.isArray(d)?d:[d]) })
    } else { state.page=1; fetchChars() } })

  // infinite scroll
  window.addEventListener('scroll', ()=>{
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.85){
      if(state.next && !document.getElementById('loading').textContent){ state.page++; fetchChars() }
    }
  })
}, 60)
import { debounce, store } from '../utils.js'

const API='https://rickandmortyapi.com/api';

function createCard(p, favs){
  const div=document.createElement('div');
  div.className='card';
  div.innerHTML=`
    <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover rounded"/>
    <h3 class="font-bold mt-2">${p.name}</h3>
    <p class="text-sm">${p.species} · ${p.status}</p>
    <div class="flex gap-2 mt-2">
      <a class="btn" href="#/detalle?id=${p.id}">Ver detalle</a>
      <button class="btn fav">${favs.includes(p.id)?'Quitar favorito':'Agregar favorito'}</button>
    </div>
  `;
  div.querySelector('.fav').addEventListener('click',()=>{
    const favKey='rm-favs';
    let favsList = store.get(favKey,[]);
    if(!Array.isArray(favsList)) favsList=[];
    if(favsList.includes(p.id)) favsList = favsList.filter(x=>x!==p.id); else favsList.push(p.id);
    store.set(favKey,favsList);
    div.querySelector('.fav').textContent = favsList.includes(p.id)?'Quitar favorito':'Agregar favorito';
  })
  return div;
}

export default function Catalog(){
  const el=document.createElement('div');
  el.className='container';
  el.innerHTML=`
    <div class="flex gap-2 mb-4">
      <input id="search" placeholder="Buscar por nombre" class="input" />
      <label class="flex items-center"><input id="onlyFav" type="checkbox" class="mr-2"/>Solo favoritos</label>
      <select id="episodes" class="input w-64"><option value="">Todos los episodios</option></select>
    </div>
    <div id="list" class="grid gap-4" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))"></div>
    <div id="loading" class="text-center mt-4"></div>
  `;

  const list=el.querySelector('#list');
  const loading=el.querySelector('#loading');
  const search=el.querySelector('#search');
  const onlyFav=el.querySelector('#onlyFav');
  const episodes=el.querySelector('#episodes');

  let page=1; let loadingMore=false; let allPages=false; let currentQuery='';

  function renderItems(items){
    const favs=store.get('rm-favs',[]);
    items.forEach(p=>list.appendChild(createCard(p,favs)));
  }

  async function loadPage(){
    if(loadingMore||allPages) return;
    loadingMore=true; loading.textContent='Cargando...';
    try{
      const url = `${API}/character?page=${page}&name=${encodeURIComponent(currentQuery)}`;
      const res=await fetch(url);
      if(!res.ok){allPages=true;loading.textContent='No hay más.';return}
      const data=await res.json();
      renderItems(data.results);
      page++; if(!data.info.next) allPages=true;
      loading.textContent='';
    }catch(e){console.error(e);loading.textContent='Error cargando';}
    loadingMore=false;
  }

  // infinite scroll
  window.addEventListener('scroll',()=>{
    if(window.innerHeight+window.scrollY >= document.body.offsetHeight-300){loadPage()}
  })

  const doSearch = debounce(()=>{
    list.innerHTML=''; page=1; allPages=false; currentQuery=search.value.trim(); loadPage();
  },400);
  search.addEventListener('input',doSearch);

  onlyFav.addEventListener('change',()=>{
    const favs=store.get('rm-favs',[]);
    if(onlyFav.checked){
      list.innerHTML='';
      if(favs.length===0){loading.textContent='No hay favoritos'; return}
      loading.textContent='Cargando favoritos...';
      Promise.all(favs.map(id=>fetch(`${API}/character/${id}`).then(r=>r.json()))).then(arr=>{list.innerHTML=''; renderItems(arr); loading.textContent='';}).catch(e=>{loading.textContent='Error';console.error(e)})
    }else{list.innerHTML=''; page=1; allPages=false; loadPage()}
  })

  // load episodes options (paginated)
  async function loadEpisodes(){
    let epPage=1; let more=true; while(more){
      const r=await fetch(`${API}/episode?page=${epPage}`);
      if(!r.ok) break; const d=await r.json(); d.results.forEach(ep=>{
        const opt=document.createElement('option'); opt.value=ep.id; opt.textContent=`${ep.id} - ${ep.name}`; episodes.appendChild(opt);
      }); if(!d.info.next) more=false; else epPage++;
    }
  }
  episodes.addEventListener('change',async ()=>{
    const val=episodes.value; if(!val){ list.innerHTML=''; page=1; allPages=false; loadPage(); return}
    loading.textContent='Cargando episodio...';
    try{
      const r=await fetch(`${API}/episode/${val}`); const d=await r.json(); // d.characters array of urls
      const ids = d.characters.map(u=>u.split('/').pop());
      // paginate ids in chunks of 20
      list.innerHTML='';
      for(let i=0;i<ids.length;i+=20){
        const chunk=ids.slice(i,i+20);
        const rr=await fetch(`${API}/character/${chunk.join(',')}`); const dd=await rr.json(); const arr=Array.isArray(dd)?dd:[dd]; renderItems(arr);
      }
      loading.textContent='';
    }catch(e){loading.textContent='Error';console.error(e)}
  })

  loadEpisodes(); loadPage();
  return el;
}
