import * as tf from '@tensorflow/tfjs'
import * as toxicity from '@tensorflow-models/toxicity'

let model=null, loading=false
async function ensureModel(th=0.85){ if(model||loading) return model; loading=true; model=await toxicity.load(th); loading=false; return model }
async function analyze(text){
  await ensureModel()
  const results = await model.classify([text])
  const probs = results.map(r=>({label:r.label, match:r.results[0].match, prob:r.results[0].probabilities[1]}))
  const toxicHits = probs.filter(p=>p.match && p.prob>0.5)
  let sentiment='Neutral'; if(toxicHits.length===0) sentiment='Positivo'; if(toxicHits.length>=1) sentiment='Negativo'
  return {sentiment, probs}
}
export default function Home(){
  requestAnimationFrame(()=>{
    const f=document.getElementById('ia-form'),i=document.getElementById('ia-text'),out=document.getElementById('ia-output'),load=document.getElementById('ia-loading')
    f?.addEventListener('submit', async e=>{
      e.preventDefault()
      const text=i.value.trim(); if(!text) return;
      load.classList.remove('hidden'); out.innerHTML=''
      const r=await analyze(text); load.classList.add('hidden')
      out.innerHTML=`<div class="card"><h3 class="text-lg font-semibold mb-2">Resultado</h3>
      <p class="mb-2">Sentimiento: <span class="font-bold">${r.sentiment}</span></p>
      <details class="mt-2"><summary class="cursor-pointer">Ver etiquetas</summary>
      <ul class="list-disc pl-5 text-sm mt-2">${r.probs.map(p=>`<li>${p.label}: ${p.prob.toFixed(2)} ${p.match?"(coincide)":""}</li>`).join('')}</ul></details></div>`
    })
  })
  return `<section class="container py-10">
    <div class="grid md:grid-cols-2 gap-6 items-start">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3">SPA con IA (en tu navegador)</h1>
        <p class="text-slate-300">Vite + Tailwind, API externa y TensorFlow.js.</p>
        <div class="mt-6 flex gap-3">
          <a href="#/catalogo" class="btn">Ir al Catálogo</a>
          <a href="https://rickandmortyapi.com" target="_blank" class="btn-outline">API Rick & Morty</a>
        </div>
      </div>
      <form id="ia-form" class="card">
        <h2 class="text-xl font-bold mb-2">Analizar sentimiento</h2>
        <p class="text-sm text-slate-400 mb-4">Corre 100% en el navegador.</p>
        <textarea id="ia-text" rows="4" class="input mb-3" placeholder="Escribe aquí..."></textarea>
        <div class="flex items-center gap-3">
          <button class="btn" type="submit">Analizar</button>
          <span id="ia-loading" class="hidden text-sm text-slate-400">Cargando modelo...</span>
        </div>
        <div id="ia-output" class="mt-4"></div>
      </form>
    </div>
  </section>`
}
