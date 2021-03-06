# Vue-Adap-Table

A Vue adaptable table, some components to be used to render and control [Page Collections](https://github.com/simplitech/resource-collection)

# Install
```
npm i @simpli/vue-adap-table @simpli/resource-collection @simpli/vue-await class-transformer simple-line-icons swiper vue-awesome-swiper vue-transition-expand
```

## Import
```typescript
import Vue from 'vue'
import VueAdapTable from '@simpli/vue-adap-table'

Vue.use(VueAdapTable)
```
On your Scss:
```scss
@import "~@simpli/vue-adap-table/scss/adapOrderby";
@import "~@simpli/vue-adap-table/scss/adapPagination";
@import "~@simpli/vue-adap-table/scss/adapSearchfield";
@import "~@simpli/vue-adap-table/scss/adapExpansion";
@import "~@simpli/vue-adap-table/scss/adapSwiper";
$simple-line-font-path: "~simple-line-icons/fonts/" !default;
@import "~simple-line-icons/scss/simple-line-icons";
```

## Usage
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

  <tr v-for="item in collection.items" :key="item.$id">
    <td>
      {{ item.title }}
    </td>
    <td>
      {{ item.description }}
    </td>
  </tr>
</table>

<adap-pagination
    :collection="collection"
    :gap="optionalNumberOfNumberedPages" />
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

## Usage AdapExpansion
```html
<adap-expansion spinner="customSpinner" :collection="collection">
  <template slot="notEmpty">
    <!--example using tailwind grid system-->
    <div class="grid grid-cols-2 gap-10">
      <div v-for="item in collection.items" :key="item.$id">
        <div>
          {{ item.$tag }}
        </div>
      </div>
    </div>
  </template>

  <template slot="empty">
    <div class="text-center text-xl">
      Empty list
    </div>
  </template>

  <template slot="expand" slot-scope="props">
    <button @click="props.expandEvent">
      Load more
    </button>
  </template>
</adap-expansion>
```
On Code:
```typescript
@Component
export default class MyComponent extends Vue {
  collection = new MyCollection()

  async created() {
    await this.$await.run('customSpinner', () => this.collection.expand())
  }
}
```

## Usage AdapSwiper
AdapSwiper uses [vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper).
All vue-awesome-swiper props and events are inherited to adap-swiper. See [docs](https://github.surmon.me/vue-awesome-swiper/) to learn more

```html
<adap-swiper
  ref="adapSwiper"
  spinner="customSpinner"
  slideClass="custom-slide-class"
  :collection="collection"
  @init="updateEvent"
  @slideChange="updateEvent"
  @resize="updateEvent"
  @expand="updateEvent"
>
  <template slot="header">
    <!--Custom arrow swiper example-->
    <a v-if="!isBeginning" @click="prevSlide()" >Go Left</a>
    <a v-if="!isEnd" @click="nextSlide()" >Go Right</a>
  </template>

  <template slot="slide" slot-scope="props">
    <!--example using tailwind-->
    <div class="p-4 w-full h-80" :key="props.i">
      <div>
        {{ props.item.$tag }}
      </div>
    </div>
  </template>

  <template slot="empty">
    Empty list
  </template>
</adap-swiper>
```
On Code:
```typescript
import Swiper from 'swiper'

@Component
export default class MyComponent extends Vue {
  collection = new MyCollection()

  isBeginning = false
  isEnd = false

  async created() {
    await this.$await.run('customSpinner', () => this.collection.expand())
  }

  updateEvent(swiper: Swiper) {
    this.isBeginning = swiper.isBeginning
    this.isEnd = swiper.isEnd
  }

  nextSlide() {
    const component = this.$refs.adapSwiper?.swiperComponent as any
    if (component) {
      component.$swiper?.slideNext()
    }
  }

  prevSlide() {
    const component = this.$refs.adapSwiper?.swiperComponent as any
    if (component) {
      component.$swiper?.slidePrev()
    }
  }
}
```
