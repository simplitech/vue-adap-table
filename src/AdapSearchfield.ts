const template = `
  <input type="text"
         v-if="collection"
         class="adap-searchfield"
         v-model="collection.search"
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
