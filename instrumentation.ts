export function register() {
  // Node.js 22+ provides a broken localStorage when --localstorage-file has no valid path.
  // Always override with a safe no-op so packages that access it during SSR don't crash.
  try {
    globalThis.localStorage.getItem('__test__')
  } catch {
    // @ts-ignore
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    }
  }
}
