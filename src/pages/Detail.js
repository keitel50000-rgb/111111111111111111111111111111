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
