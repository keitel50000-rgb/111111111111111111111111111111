(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const P="modulepreload",A=function(e){return"/111111111111111111111111111111/"+e},$={},C=function(r,t,s){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),a=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(t.map(c=>{if(c=A(c),c in $)return;$[c]=!0;const p=c.endsWith(".css"),f=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${f}`))return;const d=document.createElement("link");if(d.rel=p?"stylesheet":P,p||(d.as="script"),d.crossOrigin="",d.href=c,a&&d.setAttribute("nonce",a),document.head.appendChild(d),p)return new Promise((v,E)=>{d.addEventListener("load",v),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return n.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return r().catch(o)})};(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();function H(){const e=document.createElement("nav");return e.className="nav container flex items-center justify-between",e.innerHTML=`
    <div class="flex items-center gap-4">
      <a href="#/" class="font-bold">Rick & Morty SPA</a>
      <a href="#/" class="ml-4 text-sm">Inicio</a>
      <a href="#/catalogo" class="ml-2 text-sm">Catálogo</a>
    </div>
  `,e}const M="modulepreload",q=function(e){return"/111111111111111111111111111111/"+e},S={},T=function(e,r,t){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),i=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(r.map(a=>{if(a=q(a),a in S)return;S[a]=!0;const c=a.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${p}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":M,c||(f.as="script"),f.crossOrigin="",f.href=a,i&&f.setAttribute("nonce",i),document.head.appendChild(f),c)return new Promise((d,v)=>{f.addEventListener("load",d),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${a}`)))})}))}function n(o){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=o,window.dispatchEvent(i),!i.defaultPrevented)throw o}return s.then(o=>{for(const i of o||[])i.status==="rejected"&&n(i.reason);return e().catch(n)})},w={get(e,r=null){try{const t=localStorage.getItem(e);return t?JSON.parse(t):r}catch{return r}},set(e,r){try{localStorage.setItem(e,JSON.stringify(r))}catch{}}};function O(e,r=300){let t;return(...s)=>{clearTimeout(t),t=setTimeout(()=>e(...s),r)}}function b(){const e=document.createElement("div");e.className="container",e.innerHTML=`
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
  `;const r=e.querySelector("#status"),t=e.querySelector("#result");let s=null;async function n(){r.textContent="Cargando modelo...";try{window.tf||await T(()=>C(()=>import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js"),[]),[]),window.toxicity||await T(()=>C(()=>import("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js"),[]),[]),s=await window.toxicity.load(.9),r.textContent="Modelo listo"}catch(o){r.textContent="Error cargando modelo",console.error(o)}}return e.querySelector("#analyze").addEventListener("click",async()=>{const o=e.querySelector("#txt").value.trim();if(o){s||await n(),r.textContent="Analizando...";try{const i=await s.classify([o]);t.innerHTML=i.map(a=>`<div class="card mb-2"><strong>${a.label}</strong>: ${a.results[0].match} <br/> Probabilidades: ${JSON.stringify(a.results[0].probabilities)}</div>`).join(""),r.textContent=""}catch(i){r.textContent="Error en análisis",console.error(i)}}}),e}const y="https://rickandmortyapi.com/api";function j(e,r){const t=document.createElement("div");return t.className="card",t.innerHTML=`
    <img src="${e.image}" alt="${e.name}" class="w-full h-48 object-cover rounded"/>
    <h3 class="font-bold mt-2">${e.name}</h3>
    <p class="text-sm">${e.species} · ${e.status}</p>
    <div class="flex gap-2 mt-2">
      <a class="btn" href="#/detalle?id=${e.id}">Ver detalle</a>
      <button class="btn fav">${r.includes(e.id)?"Quitar favorito":"Agregar favorito"}</button>
    </div>
  `,t.querySelector(".fav").addEventListener("click",()=>{const s="rm-favs";let n=w.get(s,[]);Array.isArray(n)||(n=[]),n.includes(e.id)?n=n.filter(o=>o!==e.id):n.push(e.id),w.set(s,n),t.querySelector(".fav").textContent=n.includes(e.id)?"Quitar favorito":"Agregar favorito"}),t}function N(){const e=document.createElement("div");e.className="container",e.innerHTML=`
    <div class="flex gap-2 mb-4">
      <input id="search" placeholder="Buscar por nombre" class="input" />
      <label class="flex items-center"><input id="onlyFav" type="checkbox" class="mr-2"/>Solo favoritos</label>
      <select id="episodes" class="input w-64"><option value="">Todos los episodios</option></select>
    </div>
    <div id="list" class="grid gap-4" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))"></div>
    <div id="loading" class="text-center mt-4"></div>
  `;const r=e.querySelector("#list"),t=e.querySelector("#loading"),s=e.querySelector("#search"),n=e.querySelector("#onlyFav"),o=e.querySelector("#episodes");let i=1,a=!1,c=!1,p="";function f(m){const l=w.get("rm-favs",[]);m.forEach(u=>r.appendChild(j(u,l)))}async function d(){if(!(a||c)){a=!0,t.textContent="Cargando...";try{const m=`${y}/character?page=${i}&name=${encodeURIComponent(p)}`,l=await fetch(m);if(!l.ok){c=!0,t.textContent="No hay más.";return}const u=await l.json();f(u.results),i++,u.info.next||(c=!0),t.textContent=""}catch(m){console.error(m),t.textContent="Error cargando"}a=!1}}window.addEventListener("scroll",()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight-300&&d()});const v=O(()=>{r.innerHTML="",i=1,c=!1,p=s.value.trim(),d()},400);s.addEventListener("input",v),n.addEventListener("change",()=>{const m=w.get("rm-favs",[]);if(n.checked){if(r.innerHTML="",m.length===0){t.textContent="No hay favoritos";return}t.textContent="Cargando favoritos...",Promise.all(m.map(l=>fetch(`${y}/character/${l}`).then(u=>u.json()))).then(l=>{r.innerHTML="",f(l),t.textContent=""}).catch(l=>{t.textContent="Error",console.error(l)})}else r.innerHTML="",i=1,c=!1,d()});async function E(){let m=1,l=!0;for(;l;){const u=await fetch(`${y}/episode?page=${m}`);if(!u.ok)break;const x=await u.json();x.results.forEach(h=>{const g=document.createElement("option");g.value=h.id,g.textContent=`${h.id} - ${h.name}`,o.appendChild(g)}),x.info.next?m++:l=!1}}return o.addEventListener("change",async()=>{const m=o.value;if(!m){r.innerHTML="",i=1,c=!1,d();return}t.textContent="Cargando episodio...";try{const l=(await(await fetch(`${y}/episode/${m}`)).json()).characters.map(u=>u.split("/").pop());r.innerHTML="";for(let u=0;u<l.length;u+=20){const x=l.slice(u,u+20),h=await(await fetch(`${y}/character/${x.join(",")}`)).json(),g=Array.isArray(h)?h:[h];f(g)}t.textContent=""}catch(l){t.textContent="Error",console.error(l)}}),E(),d(),e}function k(){const e=new URLSearchParams(location.hash.split("?")[1]).get("id"),r=document.createElement("div");return r.className="container",r.innerHTML='<div class="card">Cargando...</div>',fetch(`https://rickandmortyapi.com/api/character/${e}`).then(t=>t.json()).then(t=>{r.innerHTML=`<div class="card">
      <div class="grid grid-cols-2 gap-4">
        <div><img src="${t.image}" alt="${t.name}"/></div>
        <div>
          <h2 class="text-2xl font-bold">${t.name}</h2>
          <p>Status: ${t.status}</p>
          <p>Species: ${t.species}</p>
          <p>Gender: ${t.gender}</p>
          <p>Origin: ${t.origin.name}</p>
          <p>Location: ${t.location.name}</p>
          <p>Episodes: ${t.episode.length}</p>
        </div>
      </div>
    </div>`}).catch(t=>{r.innerHTML='<div class="card">Error cargando personaje</div>',console.error(t)}),r}const I={"":b,"#/":b,"#/catalogo":N,"#/detalle":k};function _(){const e=document.getElementById("view");function r(){const t=location.hash.split("?")[0]||"#/",s=I[t]||b;e.innerHTML="";const n=s();e.appendChild(n)}window.addEventListener("hashchange",r),location.hash||(location.hash="#/"),r()}const L=document.getElementById("app");window.addEventListener("error",e=>{L.insertAdjacentHTML("beforeend",`<pre style="color:red">JS error: ${e.message}</pre>`)});L.innerHTML=`
  <div id="root">
    <header id="nav"></header>
    <main id="view">
      <h1 class="text-3xl font-bold text-center mt-8">Rick & Morty SPA</h1>
      <p class="text-center">Cargando…</p>
    </main>
  </div>
`;try{const e=H();document.getElementById("nav").appendChild(e),_()}catch(e){console.error(e),L.insertAdjacentHTML("beforeend",`<pre style="color:red">Init error: ${e.message}</pre>`)}
