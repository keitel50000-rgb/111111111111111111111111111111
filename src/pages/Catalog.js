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
