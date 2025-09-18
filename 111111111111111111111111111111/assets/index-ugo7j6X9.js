(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function T(){const e=document.createElement("nav");return e.className="nav container flex items-center justify-between",e.innerHTML=`
    <div class="flex items-center gap-4">
      <a href="#/" class="font-bold">Rick & Morty SPA</a>
      <a href="#/" class="ml-4 text-sm">Inicio</a>
      <a href="#/catalogo" class="ml-2 text-sm">Catálogo</a>
    </div>
  `,e}const P="modulepreload",H=function(e){return"/111111111111111111111111111111/"+e},$={},C=function(n,t,o){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(t.map(l=>{if(l=H(l),l in $)return;$[l]=!0;const h=l.endsWith(".css"),p=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${p}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":P,h||(d.as="script"),d.crossOrigin="",d.href=l,i&&d.setAttribute("nonce",i),document.head.appendChild(d),h)return new Promise((w,E)=>{d.addEventListener("load",w),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return r.then(a=>{for(const i of a||[])i.status==="rejected"&&s(i.reason);return n().catch(s)})},x={get(e,n=null){try{const t=localStorage.getItem(e);return t?JSON.parse(t):n}catch{return n}},set(e,n){try{localStorage.setItem(e,JSON.stringify(n))}catch{}}};function M(e,n=300){let t;return(...o)=>{clearTimeout(t),t=setTimeout(()=>e(...o),n)}}function L(){const e=document.createElement("div");e.className="container",e.innerHTML=`
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
  `;const n=e.querySelector("#status"),t=e.querySelector("#result");let o=null;async function r(){n.textContent="Cargando modelo...";try{window.tf||await C(()=>import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js"),[]),window.toxicity||await C(()=>import("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js"),[]),o=await window.toxicity.load(.9),n.textContent="Modelo listo"}catch(s){n.textContent="Error cargando modelo",console.error(s)}}return e.querySelector("#analyze").addEventListener("click",async()=>{const s=e.querySelector("#txt").value.trim();if(s){o||await r(),n.textContent="Analizando...";try{const a=await o.classify([s]);t.innerHTML=a.map(i=>`<div class="card mb-2"><strong>${i.label}</strong>: ${i.results[0].match} <br/> Probabilidades: ${JSON.stringify(i.results[0].probabilities)}</div>`).join(""),n.textContent=""}catch(a){n.textContent="Error en análisis",console.error(a)}}}),e}const y="https://rickandmortyapi.com/api";function q(e,n){const t=document.createElement("div");return t.className="card",t.innerHTML=`
    <img src="${e.image}" alt="${e.name}" class="w-full h-48 object-cover rounded"/>
    <h3 class="font-bold mt-2">${e.name}</h3>
    <p class="text-sm">${e.species} · ${e.status}</p>
    <div class="flex gap-2 mt-2">
      <a class="btn" href="#/detalle?id=${e.id}">Ver detalle</a>
      <button class="btn fav">${n.includes(e.id)?"Quitar favorito":"Agregar favorito"}</button>
    </div>
  `,t.querySelector(".fav").addEventListener("click",()=>{const o="rm-favs";let r=x.get(o,[]);Array.isArray(r)||(r=[]),r.includes(e.id)?r=r.filter(s=>s!==e.id):r.push(e.id),x.set(o,r),t.querySelector(".fav").textContent=r.includes(e.id)?"Quitar favorito":"Agregar favorito"}),t}function A(){const e=document.createElement("div");e.className="container",e.innerHTML=`
    <div class="flex gap-2 mb-4">
      <input id="search" placeholder="Buscar por nombre" class="input" />
      <label class="flex items-center"><input id="onlyFav" type="checkbox" class="mr-2"/>Solo favoritos</label>
      <select id="episodes" class="input w-64"><option value="">Todos los episodios</option></select>
    </div>
    <div id="list" class="grid gap-4" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))"></div>
    <div id="loading" class="text-center mt-4"></div>
  `;const n=e.querySelector("#list"),t=e.querySelector("#loading"),o=e.querySelector("#search"),r=e.querySelector("#onlyFav"),s=e.querySelector("#episodes");let a=1,i=!1,l=!1,h="";function p(u){const c=x.get("rm-favs",[]);u.forEach(f=>n.appendChild(q(f,c)))}async function d(){if(!(i||l)){i=!0,t.textContent="Cargando...";try{const u=`${y}/character?page=${a}&name=${encodeURIComponent(h)}`,c=await fetch(u);if(!c.ok){l=!0,t.textContent="No hay más.";return}const f=await c.json();p(f.results),a++,f.info.next||(l=!0),t.textContent=""}catch(u){console.error(u),t.textContent="Error cargando"}i=!1}}window.addEventListener("scroll",()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight-300&&d()});const w=M(()=>{n.innerHTML="",a=1,l=!1,h=o.value.trim(),d()},400);o.addEventListener("input",w),r.addEventListener("change",()=>{const u=x.get("rm-favs",[]);if(r.checked){if(n.innerHTML="",u.length===0){t.textContent="No hay favoritos";return}t.textContent="Cargando favoritos...",Promise.all(u.map(c=>fetch(`${y}/character/${c}`).then(f=>f.json()))).then(c=>{n.innerHTML="",p(c),t.textContent=""}).catch(c=>{t.textContent="Error",console.error(c)})}else n.innerHTML="",a=1,l=!1,d()});async function E(){let u=1,c=!0;for(;c;){const f=await fetch(`${y}/episode?page=${u}`);if(!f.ok)break;const v=await f.json();v.results.forEach(m=>{const g=document.createElement("option");g.value=m.id,g.textContent=`${m.id} - ${m.name}`,s.appendChild(g)}),v.info.next?u++:c=!1}}return s.addEventListener("change",async()=>{const u=s.value;if(!u){n.innerHTML="",a=1,l=!1,d();return}t.textContent="Cargando episodio...";try{const v=(await(await fetch(`${y}/episode/${u}`)).json()).characters.map(m=>m.split("/").pop());n.innerHTML="";for(let m=0;m<v.length;m+=20){const g=v.slice(m,m+20),b=await(await fetch(`${y}/character/${g.join(",")}`)).json(),S=Array.isArray(b)?b:[b];p(S)}t.textContent=""}catch(c){t.textContent="Error",console.error(c)}}),E(),d(),e}function j(){const n=new URLSearchParams(location.hash.split("?")[1]).get("id"),t=document.createElement("div");return t.className="container",t.innerHTML='<div class="card">Cargando...</div>',fetch(`https://rickandmortyapi.com/api/character/${n}`).then(o=>o.json()).then(o=>{t.innerHTML=`<div class="card">
      <div class="grid grid-cols-2 gap-4">
        <div><img src="${o.image}" alt="${o.name}"/></div>
        <div>
          <h2 class="text-2xl font-bold">${o.name}</h2>
          <p>Status: ${o.status}</p>
          <p>Species: ${o.species}</p>
          <p>Gender: ${o.gender}</p>
          <p>Origin: ${o.origin.name}</p>
          <p>Location: ${o.location.name}</p>
          <p>Episodes: ${o.episode.length}</p>
        </div>
      </div>
    </div>`}).catch(o=>{t.innerHTML='<div class="card">Error cargando personaje</div>',console.error(o)}),t}const N={"":L,"#/":L,"#/catalogo":A,"#/detalle":j};function O(){const e=document.getElementById("view");function n(){const t=location.hash.split("?")[0]||"#/",o=N[t]||L;e.innerHTML="";const r=o();e.appendChild(r)}window.addEventListener("hashchange",n),location.hash||(location.hash="#/"),n()}const I=document.getElementById("app");I.innerHTML=`
  <div id="root">
    <header id="nav"></header>
    <main id="view"></main>
  </div>
`;const _=T();document.getElementById("nav").appendChild(_);O();
