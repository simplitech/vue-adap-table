const template = `
  <input type="text"
         v-if="collection"
         v-bind="vBind"
         v-on="vOn"
         v-model="collection.search"
         class="adap-searchfield"
         @keyup="search"
  />
`

import { Component, Prop, Vue } from 'vue-property-decorator'
import { PageCollection, IResource } from '@simpli/resource-collection'

const debounce = require('lodash.debounce')

@Component({ template })
export class AdapSearchfield extends Vue {
  @Prop({ required: true })
  collection!: PageCollection<IResource>

  @Prop({ type: Number, default: 1000 })
  debounceTimer!: number

  get vBind() {
    return { ...this.$attrs }
  }

  get vOn() {
    const listeners = { ...this.$listeners }
    delete listeners.input
    return { ...listeners }
  }

  get querySearch(): () => Promise<any> {
    return debounce(() => this.debounceQuerySearch(), this.debounceTimer)
  }

  async debounceQuerySearch() {
    await this.collection.querySearch()
  }

  async search() {
    await this.querySearch()
  }
}
