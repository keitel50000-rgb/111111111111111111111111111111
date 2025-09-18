export async function Home(){
  return `
  <div class="max-w-5xl mx-auto px-4 py-6">
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <h2 class="text-2xl font-semibold mb-3">Analizador de texto (IA)</h2>
      <p class="text-sm text-zinc-600 mb-4">Analiza si el texto contiene contenido tóxico usando TensorFlow.js (modelo toxicity).</p>
      <textarea id="tox-input" rows="4" class="w-full rounded-lg border px-3 py-2 mb-3" placeholder="Escribe un texto para analizar..."></textarea>
      <div class="flex gap-2">
        <button id="tox-run" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700">Analizar</button>
        <button id="tox-clear" class="border rounded-lg px-4 py-2">Limpiar</button>
      </div>
      <div id="tox-results" class="mt-4"></div>
    </div>
  </div>
  `
}

async function ensureModel(){
  if(window.__toxicityModel) return window.__toxicityModel
  // load TF and toxicity from CDN
  if(!window.tf){
    await import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js')
  }
  const mod = await import('https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js')
  const model = await mod.load(0.85)
  window.__toxicityModel = model
  return model
}

// behavior binding (client side)
setTimeout(()=>{
  const run = document.getElementById('tox-run')
  const clr = document.getElementById('tox-clear')
  if(!run) return
  run.addEventListener('click', async ()=>{
    const txt = document.getElementById('tox-input').value.trim()
    const out = document.getElementById('tox-results')
    out.innerHTML = 'Cargando modelo...'
    try{
      const model = await ensureModel()
      const preds = await model.classify([txt])
      out.innerHTML = preds.map(p=>{
        const match = p.results[0] && p.results[0].match
        const prob = p.results[0] && p.results[0].probabilities && Math.max(...p.results[0].probabilities).toFixed(2)
        return `<div class="p-2 border-b"><strong>${p.label}</strong>: ${match ? '<span class="text-red-600 font-semibold">Tóxico</span>' : '<span class="text-green-700">No</span>'} <span class="ml-2 text-sm text-zinc-600">score: ${prob ?? '0.00'}</span></div>`
      }).join('')
    }catch(e){
      out.innerHTML = `<div class="text-red-600">Error al cargar modelo: ${e.message}</div>`
    }
  })
  if(clr) clr.addEventListener('click', ()=>{ document.getElementById('tox-input').value=''; document.getElementById('tox-results').innerHTML=''; })
}, 50)

