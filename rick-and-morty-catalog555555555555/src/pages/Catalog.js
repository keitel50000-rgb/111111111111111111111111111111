import { navigate } from '../router.js'
import { store, debounce } from '../utils.js'
const API='https://rickandmortyapi.com/api', FAVORITES='rm-favs'
let page=1, loading=false, hasMore=true, onlyFavs=false, q='', ep=''
const getFavs=()=>new Set(store.get(FAVORITES, []))
const setFavs=s=>store.set(FAVORITES, Array.from(s))
async function fetchJSON(u){ const r=await fetch(u); if(!r.ok) throw new Error('HTTP '+r.status); return r.json() }
async function fetchCharacters({query='',episode=''}={}){
  if(onlyFavs){ const ids=[...getFavs()]; if(!ids.length) return []; const batches=[]; for(let i=0;i<ids.length;i+=20){ const sub=ids.slice(i,i+20).join(','); const data=await fetchJSON(`${API}/character/${sub}`); batches.push(...(Array.isArray(data)?data:[data])) } return batches.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())) }
  if(episode){ const info=await fetchJSON(`${API}/episode/${episode}`); const ids=info.characters.map(u=>u.split('/').pop()); const batch=ids.slice((page-1)*20,page*20); if(!batch.length){ hasMore=false; return [] } const data=await fetchJSON(`${API}/character/${batch.join(',')}`); return Array.isArray(data)?data:[data] }
  const params=new URLSearchParams(); if(query) params.set('name',query); params.set('page',String(page)); const data=await fetchJSON(`${API}/character/?${params}`); hasMore=Boolean(data.info?.next); return data.results
}
function card(c){ const favs=getFavs(), ok=favs.has(String(c.id))
  return `<article class="card flex gap-4">
    <img src="${c.image}" alt="${c.name}" class="w-28 h-28 object-cover rounded-xl border border-slate-800" loading="lazy"/>
    <div class="flex-1">
      <h3 class="text-lg font-bold">${c.name}</h3>
      <p class="text-sm text-slate-400">${c.species} · ${c.status}</p>
      <div class="flex flex-wrap gap-2 mt-3">
        <button class="btn" data-detail="${c.id}">Ver detalle</button>
        <button class="btn-outline" data-fav="${c.id}">${ok?'Quitar favorito':'Agregar favorito'}</button>
      </div>
    </div>
  </article>`
}
function attach(){
  const container=document.getElementById('cards')
  container?.addEventListener('click',e=>{
    const d=e.target.dataset
    if(d.detail) navigate(`/detalle?id=${d.detail}`)
    if(d.fav){ const favs=getFavs(); const id=String(d.fav); favs.has(id)?favs.delete(id):favs.add(id); setFavs(favs); e.target.textContent=favs.has(id)?'Quitar favorito':'Agregar favorito' }
  })
  document.getElementById('q')?.addEventListener('input',debounce(e=>{ q=e.target.value; resetAndLoad() },400))
  document.getElementById('onlyFavs')?.addEventListener('change',e=>{ onlyFavs=e.target.checked; resetAndLoad() })
  document.getElementById('episode')?.addEventListener('change',e=>{ ep=e.target.value; resetAndLoad() })
  window.addEventListener('scroll', async ()=>{ if(loading||!hasMore||onlyFavs) return; const near=window.innerHeight+window.scrollY>=document.body.offsetHeight-200; if(near){ page++; await loadMore() } }, {passive:true})
}
async function loadEpisodes(){
  const s=document.getElementById('episode')
  try{ const data=await fetchJSON(`${API}/episode`); const pages=data.info?.pages??1; const all=[...data.results]; for(let p=2;p<=pages;p++){ const d=await fetchJSON(`${API}/episode?page=${p}`); all.push(...d.results) } s.innerHTML='<option value="">Todos</option>'+all.map(e=>`<option value="${e.id}">${e.episode} - ${e.name}</option>`).join('') }catch{ s.innerHTML='<option value="">(No cargó)</option>' }
}
async function resetAndLoad(){ page=1; hasMore=true; const c=document.getElementById('cards'); c.innerHTML=''; await loadMore(true) }
async function loadMore(){ loading=true; const loader=document.getElementById('loader'); loader.classList.remove('hidden')
  try{ const chars=await fetchCharacters({query:q, episode:ep}); const c=document.getElementById('cards'); c.insertAdjacentHTML('beforeend', chars.map(card).join('')); if(onlyFavs||!chars.length) hasMore=false }
  catch(e){ document.getElementById('cards').innerHTML=`<div class="text-sm text-red-300">Error: ${e?.message||''}</div>`; hasMore=false }
  finally{ loader.classList.add('hidden'); loading=false }
}
export default function Catalog(){
  requestAnimationFrame(async()=>{ attach(); await loadEpisodes(); await resetAndLoad() })
  return `<section class="py-8 container">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div><h1 class="text-2xl font-bold">Catálogo</h1><p class="text-slate-400 text-sm">Búsqueda, favoritos, filtro por episodio y scroll infinito.</p></div>
      <label class="flex items-center gap-2 text-sm"><input id="onlyFavs" type="checkbox" class="accent-primary-600"/>Solo favoritos</label>
    </div>
    <div class="grid md:grid-cols-3 gap-4 mb-6">
      <input id="q" class="input" placeholder="Buscar por nombre..."/>
      <select id="episode" class="input"></select>
      <button class="btn" onclick="location.reload()">Reiniciar</button>
    </div>
    <div id="cards" class="grid-cards"></div>
    <div id="loader" class="hidden text-center py-8 text-slate-400">Cargando...</div>
  </section>`
}
