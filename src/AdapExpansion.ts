const template = `
  <div class="expansible">
    <slot name="header" />

    <div ref="content" class="expansible__content">
      <div>
        <template v-if="collection.items && !collection.isEmpty()">
          <slot name="notEmpty" />
        </template>
      </div>

      <await
        spinner="none"
        :name="spinner"
        class="await__spinner--screen-light"
      />
    </div>

    <div ref="bottom">
      <await :name="spinner" spinnerPadding="22.5px">
        <transition name="fade" mode="out-in">
          <div v-if="collection.items && collection.isEmpty()" :key="1">
            <slot name="empty" />
          </div>

          <div v-else-if="!collection.isLastPage" :key="2">
            <slot name="expand" :expandEvent="expand" />
          </div>
        </transition>
      </await>
    </div>
  </div>
`

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { ResizeSensor } from 'css-element-queries'
import { ExpansibleCollection, IResource } from '@simpli/resource-collection'

@Component({ template })
export class AdapExpansion extends Vue {
  @Prop({ type: Object, required: true })
  collection!: ExpansibleCollection<IResource>
  @Prop({ type: String, default: 'list' })
  spinner!: string
  @Prop({ type: Boolean, default: true })
  autoScroll!: boolean

  sensor: ResizeSensor | null = null

  mounted() {
    const el = this.$refs.content as HTMLElement
    const elChild = el.childNodes[0] as HTMLElement
    this.sensor = new ResizeSensor(elChild, ({ height }: Record<string, number>) => this.refreshHeight(height))
  }

  beforeDestroy() {
    if (this.sensor) {
      this.sensor.detach()
      this.sensor = null
    }
  }

  async expand() {
    // @ts-ignore
    if (this.$await) {
      // @ts-ignore
      await this.$await.run(this.spinner, () => this.collection.expand())
    } else {
      await this.collection.expand()
    }

    this.$emit('expand')

    if (this.autoScroll) {
      const el = this.$refs.bottom as HTMLElement
      // @ts-ignore
      if (this.$scrollTo) {
        // @ts-ignore
        this.$scrollTo(el)
      }
    }
  }

  async refreshHeight(height: number) {
    const el = this.$refs.content as HTMLElement
    el.style.height = `${height}px`
    el.style.overflow = 'hidden'
    await new Promise(resolve => setTimeout(resolve, 1000))
    el.style.overflow = 'unset'
  }
}
