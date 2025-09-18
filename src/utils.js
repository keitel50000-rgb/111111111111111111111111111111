export const store = {
  get(key, fallback=null){
    try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch(e){return fallback}
  },
  set(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(e){}
  }
}

export function debounce(fn,ms=300){let t;return (...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms)}}
