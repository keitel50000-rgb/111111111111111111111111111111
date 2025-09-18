(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();function $(){return`
  <nav class="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
    <div class="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
      <a href="#/" class="font-bold text-xl">Rick & Morty SPA</a>
      <div class="space-x-4">
        <a class="hover:underline" href="#/">Inicio</a>
        <a class="hover:underline" href="#/catalogo">Catálogo</a>
      </div>
    </div>
  </nav>
  `}const L="modulepreload",I=function(o){return"/111111111111111111111111111111/"+o},v={},h=function(e,n,t){let s=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(n.map(c=>{if(c=I(c),c in v)return;v[c]=!0;const u=c.endsWith(".css"),w=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${w}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":L,u||(d.as="script"),d.crossOrigin="",d.href=c,l&&d.setAttribute("nonce",l),document.head.appendChild(d),u)return new Promise((b,E)=>{d.addEventListener("load",b),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&a(l.reason);return e().catch(a)})};async function T(){return`
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
  `}async function C(){if(window.__toxicityModel)return window.__toxicityModel;window.tf||await h(()=>import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js"),[]);const e=await(await h(()=>import("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js"),[])).load(.85);return window.__toxicityModel=e,e}setTimeout(()=>{const o=document.getElementById("tox-run"),e=document.getElementById("tox-clear");o&&(o.addEventListener("click",async()=>{const n=document.getElementById("tox-input").value.trim(),t=document.getElementById("tox-results");t.innerHTML="Cargando modelo...";try{const a=await(await C()).classify([n]);t.innerHTML=a.map(r=>{const l=r.results[0]&&r.results[0].match,c=r.results[0]&&r.results[0].probabilities&&Math.max(...r.results[0].probabilities).toFixed(2);return`<div class="p-2 border-b"><strong>${r.label}</strong>: ${l?'<span class="text-red-600 font-semibold">Tóxico</span>':'<span class="text-green-700">No</span>'} <span class="ml-2 text-sm text-zinc-600">score: ${c??"0.00"}</span></div>`}).join("")}catch(s){t.innerHTML=`<div class="text-red-600">Error al cargar modelo: ${s.message}</div>`}}),e&&e.addEventListener("click",()=>{document.getElementById("tox-input").value="",document.getElementById("tox-results").innerHTML=""}))},50);const x={get(o,e=[]){try{return JSON.parse(localStorage.getItem(o))??e}catch{return e}},set(o,e){try{localStorage.setItem(o,JSON.stringify(e))}catch{}}},B=(o,e=400)=>{let n;return(...t)=>{clearTimeout(n),n=setTimeout(()=>o(...t),e)}},m="https://rickandmortyapi.com/api";async function S(){return`
  <div class="max-w-5xl mx-auto px-4 py-6">
    <div class="flex gap-2 mb-4">
      <input id="search" placeholder="Buscar por nombre..." class="w-full rounded-lg border px-3 py-2" />
      <select id="episode" class="rounded-lg border px-3 py-2"><option value="">Todos los episodios</option></select>
      <label class="flex items-center gap-2"><input type="checkbox" id="only-favs"> Solo favoritos</label>
    </div>
    <div id="grid" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
    <div id="loading" class="py-6 text-center"></div>
  </div>`}let i={query:"",page:1,next:null,favs:new Set(x.get("rm-favs",[])),episode:""};async function A(){const e=await(await fetch(m+"/episode")).json(),n=document.getElementById("episode");n&&e.results.forEach(t=>{const s=document.createElement("option");s.value=t.id,s.textContent=`${t.episode} — ${t.name}`,n.appendChild(s)})}function g(o){const e=document.getElementById("grid");i.page===1&&(e.innerHTML=""),o.forEach(n=>{const t=document.createElement("div");t.className="bg-white rounded-2xl shadow-sm p-3 border",t.innerHTML=`
      <img src="${n.image}" class="w-full rounded-lg mb-2" />
      <h3 class="font-semibold">${n.name}</h3>
      <p class="text-sm text-zinc-600">${n.species} — ${n.status}</p>
      <div class="mt-3 flex gap-2">
        <button data-id="${n.id}" class="fav-btn border rounded-lg px-3 py-1">${i.favs.has(n.id)?"★ Quitar":"☆ Favorito"}</button>
        <a href="#/detalle?id=${n.id}" class="ml-auto rounded-lg px-3 py-1 border hover:bg-zinc-50">Ver detalle</a>
      </div>
    `,e.appendChild(t)}),_()}function _(){document.querySelectorAll(".fav-btn").forEach(o=>{o.onclick=()=>{const e=Number(o.dataset.id);i.favs.has(e)?(i.favs.delete(e),o.textContent="☆ Favorito"):(i.favs.add(e),o.textContent="★ Quitar"),x.set("rm-favs",Array.from(i.favs))}})}async function p(){const o=document.getElementById("grid"),e=document.getElementById("loading");e.textContent="Cargando...";let n=`${m}/character/?page=${i.page}`;if(i.query&&(n=`${m}/character/?name=${encodeURIComponent(i.query)}&page=${i.page}`),i.episode){const r=(await(await fetch(`${m}/episode/${i.episode}`)).json()).characters.map(u=>u.split("/").pop()).slice((i.page-1)*20,i.page*20),c=await(await fetch(`${m}/character/${r.join(",")}`)).json();g(Array.isArray(c)?c:[c]),e.textContent="";return}try{const s=await(await fetch(n)).json();g(s.results||[]),i.next=s.info&&s.info.next}catch{o.innerHTML='<div class="col-span-full text-center text-zinc-600">No hay resultados</div>'}e.textContent=""}setTimeout(()=>{const o=document.getElementById("search"),e=document.getElementById("only-favs"),n=document.getElementById("episode");A(),p(),o&&o.addEventListener("input",B(t=>{i.query=t.target.value,i.page=1,p()},400)),n&&n.addEventListener("change",t=>{i.episode=t.target.value,i.page=1,p()}),e&&e.addEventListener("change",t=>{if(t.target.checked){const s=Array.from(i.favs);if(s.length===0){document.getElementById("grid").innerHTML='<div class="col-span-full text-center">No favoritos</div>';return}fetch(`${m}/character/${s.join(",")}`).then(a=>a.json()).then(a=>{g(Array.isArray(a)?a:[a])})}else i.page=1,p()}),window.addEventListener("scroll",()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight*.85&&i.next&&!document.getElementById("loading").textContent&&(i.page++,p())})},60);async function M({params:o}){const e=o.get("id");if(!e)return'<div class="py-8 text-center">ID no provisto</div>';try{const t=await(await fetch(`https://rickandmortyapi.com/api/character/${e}`)).json();return`
      <div class="max-w-3xl mx-auto px-4 py-6">
        <div class="bg-white rounded-2xl shadow p-6 grid gap-4 md:grid-cols-3">
          <img src="${t.image}" class="rounded-lg md:col-span-1" />
          <div class="md:col-span-2">
            <h2 class="text-2xl font-semibold">${t.name}</h2>
            <p class="text-sm text-zinc-600">${t.species} • ${t.status} • ${t.gender}</p>
            <p class="mt-3"><strong>Origin:</strong> ${t.origin.name}</p>
            <p><strong>Location:</strong> ${t.location.name}</p>
            <div class="mt-4">
              <a href="#/catalogo" class="inline-flex items-center gap-2 rounded-lg px-4 py-2 border">Volver al catálogo</a>
              <button id="fav-btn" class="ml-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-indigo-600 text-white">Favorito</button>
            </div>
            <div class="mt-4">
              <h3 class="font-semibold">Episodios</h3>
              <ul class="list-disc ml-5 text-sm text-zinc-700">${t.episode.map(s=>`<li>${s}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
      </div>
    `}catch(n){return`<div class="py-8 text-center text-red-600">Error: ${n.message}</div>`}}setTimeout(()=>{const o=document.getElementById("fav-btn");if(!o)return;const e=new URL(location.href),n=Number(e.searchParams.get("id")),t=new Set(JSON.parse(localStorage.getItem("rm-favs")||"[]"));t.has(n)&&(o.textContent="★ Quitar"),o.addEventListener("click",()=>{t.has(n)?(t.delete(n),o.textContent="Favorito"):(t.add(n),o.textContent="★ Quitar"),localStorage.setItem("rm-favs",JSON.stringify(Array.from(t)))})},50);async function f(o){const e=document.getElementById("view");e.innerHTML='<div class="py-8">Cargando...</div>';try{e.innerHTML=await o()}catch(n){e.innerHTML=`<pre class="text-red-600">Error: ${n.message}</pre>`}}async function y(){const o=location.hash||"#/",[e,n]=o.split("?"),t=new URLSearchParams(n||"");if(e==="#/")return f(T);if(e==="#/catalogo")return f(S);if(e==="#/detalle")return f(()=>M({params:t}));const s=document.getElementById("view");s.innerHTML='<div class="py-8 text-center">Página no encontrada</div>'}window.addEventListener("hashchange",y);const P=document.getElementById("app");P.innerHTML=`${$()}<main id="view" class="max-w-5xl mx-auto px-4 py-6"></main>`;location.hash||(location.hash="#/");y();
