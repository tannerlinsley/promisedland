export default {
  get: key => {
    try {
      return JSON.parse(window.localStorage.getItem(key))
    } catch (err) {
      return undefined
    }
  },
  set: (key, val) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch (err) {
      //
    }
    return val
  },
}
