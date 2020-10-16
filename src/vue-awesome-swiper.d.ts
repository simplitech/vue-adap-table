declare module 'vue-awesome-swiper' {
  import Swiper, { SwiperOptions } from 'swiper'
  import Vue, { PluginObject } from 'vue'

  interface VueAwesomeSwiper extends PluginObject<SwiperOptions> {
    Swiper: Swiper
    swiper: Vue
    swiperSlide: Vue
  }

  const VueAwesomeSwiper: VueAwesomeSwiper
  export default VueAwesomeSwiper

  export const swiper: Vue
  export const swiperSlide: Vue

  export { default as Swiper } from 'swiper'

  export class SwiperComponent extends Vue {
    $swiper: Swiper
    options: SwiperOptions
    globalOptions: SwiperOptions
    classes: {
      wrapperClass: string
    }
    update(): void
    mountInstance(): void
    bindEvents(): void
  }
}
