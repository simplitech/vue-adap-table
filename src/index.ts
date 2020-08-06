import { Vue as _Vue } from 'vue/types/vue'
import { AdapExpansion } from './AdapExpansion'
import { AdapOrderby } from './AdapOrderby'
import { AdapPagination } from './AdapPagination'
import { AdapSearchfield } from './AdapSearchfield'
import { AdapSwiper } from './AdapSwiper'
import { MixinAdapRoute } from './MixinAdapRoute'
import { MixinAdapScreenSize } from './MixinAdapScreenSize'

export interface AdapTableOptions {
  defaultBeforeQueryAction?: () => void
  defaultAfterQueryAction?: () => void
  defaultErrorQueryAction?: () => void
  screenBounds?: {
    small?: number
    medium?: number
    large?: number
  }
}

export default class AdapTableWrapper {
  static options: AdapTableOptions = {}

  static get screenSmall() {
    if (this.options.screenBounds && this.options.screenBounds.small) {
      return this.options.screenBounds.small
    }
    return 640
  }

  static get screenMedium() {
    if (this.options.screenBounds && this.options.screenBounds.medium) {
      return this.options.screenBounds.medium
    }
    return 768
  }

  static get screenLarge() {
    if (this.options.screenBounds && this.options.screenBounds.large) {
      return this.options.screenBounds.large
    }
    return 1024
  }

  static install(Vue: typeof _Vue, options?: AdapTableOptions) {
    this.options = options || {}

    Vue.component('AdapExpansion', AdapExpansion)
    Vue.component('AdapSwiper', AdapSwiper)
    Vue.component('AdapOrderby', AdapOrderby)
    Vue.component('AdapPagination', AdapPagination)
    Vue.component('AdapSearchfield', AdapSearchfield)
  }
}

export { AdapOrderby, AdapPagination, AdapSearchfield, MixinAdapRoute, MixinAdapScreenSize }
