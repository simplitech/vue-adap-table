const template = `
  <div class="adap-swiper">
    <transition-expand>
      <div v-if="slides.length" :key="1">
        <slot name="header" />

        <div class="adap-swiper__content">
          <swiper
            ref="swiperComponent"
            class="swiper-container--sm-edge-preview"
            :options="options"
            @slideChange="pageChangeEvent"
          >
            <swiper-slide
              v-for="(item, i) in slides"
              :key="item.$id"
              :class="slideClass"
            >
              <slot name="slide" :item="item" :i="i" />
            </swiper-slide>
          </swiper>

          <await :name="spinner" class="await__spinner--screen-light" style="z-index: 10" />
        </div>
      </div>

      <div v-else :key="2">
        <await :name="spinner">
          <slot name="empty" />
        </await>
      </div>
    </transition-expand>
  </div>
`

import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import { ExpansibleCollection, IResource } from '@simpli/resource-collection'
import { SwiperOptions } from 'swiper'
import { MixinAdapScreenSize } from './MixinAdapScreenSize'
// @ts-ignore
import { SwiperComponent } from 'vue-awesome-swiper'
import AdapTableWrapper from './index'

@Component({ template })
export class AdapSwiper extends Mixins(MixinAdapScreenSize) {
  @Prop({ type: Object, required: true })
  collection!: ExpansibleCollection<IResource>
  @Prop({ type: String })
  slideClass?: string
  @Prop({ type: String, default: 'list' })
  spinner!: string
  @Prop({ type: Object })
  options?: SwiperOptions

  locked = false
  slides: IResource[] = []
  isBeginning = true
  isEnd = false

  SMALL_SCREEN = AdapTableWrapper.screenSmall
  MEDIUM_SCREEN = AdapTableWrapper.screenMedium
  LARGE_SCREEN = AdapTableWrapper.screenLarge

  /**
   * In order to clean the cache, the collection empty its content and then repopulate it.
   * To prevent malfunction of swiper, this watch does not accept empty list
   * @param items
   */
  @Watch('collection.items', { immediate: true })
  async itemsEvent(items: IResource[]) {
    if (items && items.length) {
      this.slides = items

      await this.$nextTick()

      // https://github.com/surmon-china/vue-awesome-swiper/issues/317
      const component = this.$refs.swiperComponent as SwiperComponent
      if (component) {
        component.swiper.destroy = () => {
          // Não executar a função nativa pois existe um bug de layout
          // A falta do destroy não interfere na performace pois o VUE já cuida do lifecycle
        }
      }
    }
  }

  get swiperComponent() {
    return this.$refs.swiperComponent as SwiperComponent | null
  }

  get breakpoints(): Record<number, SwiperOptions | undefined> {
    // @ts-ignore
    const breakpoints = (this.$swiperGlobalOptions && this.$swiperGlobalOptions.breakpoints) || {}
    return (this.options && this.options.breakpoints) || breakpoints
  }

  get mobilePerPage() {
    const breakpoints = this.breakpoints[this.SMALL_SCREEN]
    return Number(breakpoints && breakpoints.slidesPerView)
  }

  get tabletPerPage() {
    const breakpoints = this.breakpoints[this.MEDIUM_SCREEN]
    return Number(breakpoints && breakpoints.slidesPerView)
  }

  get desktopPerPage() {
    const breakpoints = this.breakpoints[this.LARGE_SCREEN]
    return Number(breakpoints && breakpoints.slidesPerView)
  }

  get perPage() {
    if (this.isMobile) return this.mobilePerPage
    if (this.isTablet) return this.tabletPerPage
    return this.desktopPerPage
  }

  get hasReachedTheLimit() {
    return this.collection.size() >= (this.collection.total || 0)
  }

  created() {
    this.collection.perPage = 4 * this.perPage
  }

  nextSlide() {
    const component = this.$refs.swiperComponent as SwiperComponent
    if (component) {
      component.swiper.slideNext()
    }
  }

  prevSlide() {
    const component = this.$refs.swiperComponent as SwiperComponent
    if (component) {
      component.swiper.slidePrev()
    }
  }

  async pageChangeEvent() {
    this.isBeginning = Boolean(
      this.swiperComponent && this.swiperComponent.swiper && this.swiperComponent.swiper.isBeginning
    )
    this.isEnd = Boolean(this.swiperComponent && this.swiperComponent.swiper && this.swiperComponent.swiper.isEnd)

    if (this.hasReachedTheLimit || this.locked) return

    if (this.isEnd) {
      await this.expand()
      this.isEnd = false
    }
  }

  async expand() {
    this.locked = true
    // @ts-ignore
    if (this.$await) {
      // @ts-ignore
      await this.$await.run(this.spinner, () => this.collection.expand())
    } else {
      await this.collection.expand()
    }
    this.locked = false
  }
}
