const template = `
  <div v-if="collection"
       @click="orderBy"
       class="adap-orderby">
    {{ label }}
    <slot></slot>
    <span :class="{
    'adap-orderby__caret': collection.orderBy === name,
    'adap-orderby__caret--asc': collection.asc,
    'adap-orderby__caret--desc': !collection.asc
    }"></span>
  </div>
`

import { Component, Prop, Vue } from 'vue-property-decorator'
import { PageCollection, IResource } from '@simpli/resource-collection'
import AdapTableWrapper from './index'

@Component({ template })
export class AdapOrderby extends Vue {
  @Prop({ required: true })
  collection!: PageCollection<IResource>

  @Prop({ required: true })
  name!: string

  @Prop({ type: String, default: '' })
  label!: string

  async orderBy() {
    const options = AdapTableWrapper.options

    try {
      this.$emit('beforeQuery')

      if (options.defaultBeforeQueryAction) {
        options.defaultBeforeQueryAction()
      }

      await this.collection.queryOrderBy(this.name)

      this.$emit('afterQuery')

      if (options.defaultAfterQueryAction) {
        options.defaultAfterQueryAction()
      }
    } catch (e) {
      this.$emit('errorQuery')

      if (options.defaultErrorQueryAction) {
        options.defaultErrorQueryAction()
      }

      throw e
    }
  }
}
