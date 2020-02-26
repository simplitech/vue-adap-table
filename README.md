# Vue-Adap-Table

A Vue adaptable table, many components to be used to render and control lists 

# Install
```
npm i @simpli/vue-adap-table @simpli/resource-collection class-transformer simple-line-icons
```

## Import
```typescript
import Vue from 'vue'
import VueAdapTable from '@simpli/vue-adap-table'

Vue.use(VueAdapTable)
```
On your Scss:
```scss
@import "~@simpli/vue-modal/scss/adapOrderby";
@import "~@simpli/vue-modal/scss/adapPagination";
@import "~@simpli/vue-modal/scss/adapSearchfield";
@import "~simple-line-icons/scss/simple-line-icons";
```

## Basic Usage
```html
<adap-searchfield :collection="collection" />

<table>
  <tr>
    <th>
      <adap-orderby :collection="collection" name="title" label="Title" />
    </th>
    <th>
      <adap-orderby :collection="collection" name="description">
        Description
      </adap-orderby>
    </th>
  </tr>

  <tr v-for="(item, i) in collection.all()" :key="item.$id">
    <td>
      {{ item.title }}
    </td>
    <td>
      {{ item.description }}
    </td>
  </tr>
</table>

<adap-pagination :collection="collection" :gap="optionalNumberOfNumberedPages" />
```
On Code:
```typescript
import {MixinAdapRoute} from '@simpli/vue-adap-table'

@Component
export default class MyComponent extends Mixins(MixinAdapRoute) {
  collection = new MyCollection()
  optionalNumberOfNumberedPages = 5 // default is 2

  async created() {
    // optionally you can use the mixin and initialize it with this method
    // so the browser URL will match the search, orderby and pagination properties
    this.initAdapRoute(this.collection)
    
    // load the collection content using the mixin
    await this.query()
  }
}
```
