export function debounce(fn, wait, immediate = false) {
  let timeout
  let result

  return function(...args) {
    const later = () => {
      clearTimeout(timeout)
      result = fn.apply(this, args)
    }
    if (immediate && !timeout) {
      timeout = setTimeout(() => {}, wait)
      later()
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
    return new Promise(r => r(result))
  }
}
