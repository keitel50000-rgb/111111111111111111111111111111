export const store = {
  get(key, def = []) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? def;
    } catch (e) {
      return def;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
  }
}

export const debounce = (fn, ms = 400) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  }
}
