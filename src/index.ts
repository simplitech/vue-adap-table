import { Vue as _Vue } from 'vue/types/vue'
import { AdapOrderby } from './AdapOrderby'
import { AdapPagination } from './AdapPagination'
import { AdapSearchfield } from './AdapSearchfield'
import { MixinAdapRoute } from './MixinAdapRoute'

export interface AdapTableOptions {
  defaultBeforeQueryAction?: () => void
  defaultAfterQueryAction?: () => void
  defaultErrorQueryAction?: () => void
}

export default class AdapTableWrapper {
  static options: AdapTableOptions = {}

  static install(Vue: typeof _Vue, options?: AdapTableOptions) {
    this.options = options || {}

    Vue.component(AdapOrderby.name, AdapOrderby)
    Vue.component(AdapPagination.name, AdapPagination)
    Vue.component(AdapSearchfield.name, AdapSearchfield)
  }
}

export { AdapOrderby, AdapPagination, AdapSearchfield, MixinAdapRoute }
