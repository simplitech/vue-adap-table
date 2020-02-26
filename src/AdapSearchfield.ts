const template = `
  <input type="text"
         v-if="collection"
         class="adap-searchfield"
         v-model="collection.search"
         @keyup="collection.querySearch()"
  />
`

import { Component, Prop, Vue } from 'vue-property-decorator'
import { PageCollection, IResource } from '@simpli/resource-collection'

@Component({ template })
export class AdapSearchfield extends Vue {
  @Prop({ required: true })
  collection!: PageCollection<IResource>
}
