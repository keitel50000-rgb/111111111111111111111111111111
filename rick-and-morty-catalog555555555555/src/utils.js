export const store={ get(k,fb){ try{ return JSON.parse(localStorage.getItem(k)) ?? fb }catch{ return fb } }, set(k,v){ localStorage.setItem(k, JSON.stringify(v)) } }
export function debounce(fn,ms=300){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms) } }
