import { debounce } from '../utils.js'

export default function Home(){
  const el=document.createElement('div');
  el.className='container';
  el.innerHTML=`
    <div class="card">
      <h2 class="text-2xl font-bold mb-2">Analizador de texto (Toxicity)</h2>
      <p class="mb-2">Escribe un texto y analiza con TensorFlow.js</p>
      <textarea id="txt" class="input mb-2" rows="4"></textarea>
      <div class="flex gap-2">
        <button id="analyze" class="btn">Analizar</button>
        <span id="status" class="text-sm"></span>
      </div>
      <div id="result" class="mt-4"></div>
    </div>
  `;

  const status=el.querySelector('#status');
  const result=el.querySelector('#result');
  let model=null;

  async function loadModel(){
    status.textContent='Cargando modelo...';
    try{
      // Cargar TF y toxicity desde CDN (runtime)
      if(!window.tf) await import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js');
      if(!window.toxicity) await import('https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js');
      // @ts-ignore
      model = await window.toxicity.load(0.9);
      status.textContent='Modelo listo';
    }catch(e){status.textContent='Error cargando modelo';console.error(e)}
  }

  el.querySelector('#analyze').addEventListener('click',async ()=>{
    const text=el.querySelector('#txt').value.trim();
    if(!text) return;
    if(!model) await loadModel();
    status.textContent='Analizando...';
    try{
      const predictions = await model.classify([text]);
      result.innerHTML = predictions.map(p=>`<div class="card mb-2"><strong>${p.label}</strong>: ${p.results[0].match} <br/> Probabilidades: ${JSON.stringify(p.results[0].probabilities)}</div>`).join('');
      status.textContent='';
    }catch(e){status.textContent='Error en análisis';console.error(e)}
  })

  return el;
}
