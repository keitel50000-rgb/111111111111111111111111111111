import { store } from '../utils/storage.js'

export async function Detail({ params }){
  const id = params.get('id')
  if(!id) return `<div class="py-8 text-center">ID no provisto</div>`
  try{
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`)
    const json = await res.json()
    return `
      <div class="max-w-3xl mx-auto px-4 py-6">
        <div class="bg-white rounded-2xl shadow p-6 grid gap-4 md:grid-cols-3">
          <img src="${json.image}" class="rounded-lg md:col-span-1" />
          <div class="md:col-span-2">
            <h2 class="text-2xl font-semibold">${json.name}</h2>
            <p class="text-sm text-zinc-600">${json.species} • ${json.status} • ${json.gender}</p>
            <p class="mt-3"><strong>Origin:</strong> ${json.origin.name}</p>
            <p><strong>Location:</strong> ${json.location.name}</p>
            <div class="mt-4">
              <a href="#/catalogo" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 border">Volver al catálogo</a>
              <button id="fav-btn" class="ml-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-indigo-600 text-white">Favorito</button>
            </div>
            <div class="mt-4">
              <h3 class="font-semibold">Episodios</h3>
              <ul class="list-disc ml-5 text-sm text-zinc-700">${json.episode.map(e=>`<li>${e}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </div>
    `
  }catch(e){
    return `<div class="py-8 text-center text-red-600">Error: ${e.message}</div>`
  }
}

setTimeout(()=>{
  const btn = document.getElementById('fav-btn')
  if(!btn) return
  const url = new URL(location.href)
  const id = Number(url.searchParams.get('id'))
  const favs = new Set(JSON.parse(localStorage.getItem('rm-favs')||'[]'))
  if(favs.has(id)) btn.textContent = '★ Quitar' 
  btn.addEventListener('click', ()=>{
    if(favs.has(id)){ favs.delete(id); btn.textContent='Favorito' }
    else { favs.add(id); btn.textContent='★ Quitar' }
    localStorage.setItem('rm-favs', JSON.stringify(Array.from(favs)))
  })
}, 50)
import { store } from '../utils.js'

export default function Detail(){
  const q=new URLSearchParams(location.hash.split('?')[1]);
  const id=q.get('id');
  const el=document.createElement('div');
  el.className='container';
  el.innerHTML='<div class="card">Cargando...</div>';
  fetch(`https://rickandmortyapi.com/api/character/${id}`).then(r=>r.json()).then(data=>{
    el.innerHTML=`<div class="card">
      <div class="grid grid-cols-2 gap-4">
        <div><img src="${data.image}" alt="${data.name}"/></div>
        <div>
          <h2 class="text-2xl font-bold">${data.name}</h2>
          <p>Status: ${data.status}</p>
          <p>Species: ${data.species}</p>
          <p>Gender: ${data.gender}</p>
          <p>Origin: ${data.origin.name}</p>
          <p>Location: ${data.location.name}</p>
          <p>Episodes: ${data.episode.length}</p>
        </div>
      </div>
    </div>`;
  }).catch(e=>{el.innerHTML='<div class="card">Error cargando personaje</div>';console.error(e)})
  return el;
}
