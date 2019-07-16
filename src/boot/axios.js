import axios from 'axios'

export default ({app, router, Vue}) => {
  Vue.prototype.$http = axios
}
