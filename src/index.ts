import Vue from 'vue'
import { AdapOrderby } from './AdapOrderby'
import { AdapPagination } from './AdapPagination'
import { AdapSearchfield } from './AdapSearchfield'
import { MixinAdapRoute } from './MixinAdapRoute'

export default class AdapTableWrapper {
  static install() {
    Vue.component(AdapOrderby.name, AdapOrderby)
    Vue.component(AdapPagination.name, AdapPagination)
    Vue.component(AdapSearchfield.name, AdapSearchfield)
  }
}

export { AdapOrderby, AdapPagination, AdapSearchfield, MixinAdapRoute }
