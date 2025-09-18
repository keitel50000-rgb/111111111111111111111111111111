async function fetchJSON(url){ const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status); return r.json() }
export default function Detail({ params }){
  const id=params.get('id')
  requestAnimationFrame(async()=>{
    const box=document.getElementById('detail-box')
    try{
      const c=await fetchJSON(`https://rickandmortyapi.com/api/character/${id}`)
      box.innerHTML=`<div class="flex flex-col md:flex-row gap-6">
        <img src="${c.image}" alt="${c.name}" class="w-56 h-56 object-cover rounded-2xl border border-slate-800 shadow"/>
        <div class="flex-1">
          <h1 class="text-3xl font-extrabold">${c.name}</h1>
          <p class="text-slate-300">${c.status} · ${c.species}${c.type?(' · '+c.type):''}</p>
          <dl class="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm">
            <dt class="text-slate-400">Género</dt><dd>${c.gender}</dd>
            <dt class="text-slate-400">Origen</dt><dd>${c.origin?.name}</dd>
            <dt class="text-slate-400">Ubicación</dt><dd>${c.location?.name}</dd>
            <dt class="text-slate-400">Episodios</dt><dd>${c.episode?.length}</dd>
          </dl>
        </div>
      </div>`
    }catch{ box.innerHTML='<p class="text-red-300">No se pudo cargar el detalle.</p>' }
  })
  return `<section class="container py-10">
    <a href="#/catalogo" class="btn-outline mb-6 inline-flex">← Volver</a>
    <div id="detail-box" class="card"></div>
  </section>`
}
