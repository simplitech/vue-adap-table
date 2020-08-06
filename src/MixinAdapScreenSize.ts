import { Component, Vue } from 'vue-property-decorator'
import AdapTableWrapper from './index'

@Component
export class MixinAdapScreenSize extends Vue {
  screenWidth = window.innerWidth

  get isMobile() {
    return this.screenWidth <= AdapTableWrapper.screenSmall
  }

  get isTablet() {
    return this.screenWidth > AdapTableWrapper.screenSmall && this.screenWidth <= AdapTableWrapper.screenMedium
  }

  get isSmallDesktop() {
    return this.screenWidth > AdapTableWrapper.screenMedium && this.screenWidth <= AdapTableWrapper.screenLarge
  }

  get isDesktop() {
    return this.screenWidth > AdapTableWrapper.screenLarge
  }

  created() {
    window.addEventListener('resize', this.resizeEvent)
    this.resizeEvent()
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeEvent)
  }

  resizeEvent() {
    this.screenWidth = window.innerWidth
  }
}
