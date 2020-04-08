const template = `
  <ul v-if="collection" class="adap-pagination">
    <li class="adap-pagination__prev">
      <a @click="prev">
        <i class="icon icon-arrow-left"></i>
      </a>
    </li>

    <li class="adap-pagination__first"
        :class="{ 'adap-pagination__first--active' : current === first }">
      <a @click="goto(first)">{{first}}</a>
    </li>

    <li v-if="current > first + gap + 1"
        class="adap-pagination__gap"><a>...</a></li>

    <li v-for="n in gap * 2 + 1" v-if="index(n) > first && index(n) < last"
        class="adap-pagination__number"
        :class="{ 'adap-pagination__number--active': current === index(n) }">
      <a @click="goto(index(n))">{{index(n)}}</a>
    </li>

    <li v-if="current < last - gap - 1"
        class="adap-pagination__gap"><a>...</a></li>

    <li v-if="last !== 1"
        class="adap-pagination__last"
        :class="{ 'adap-pagination__last--active': current === last }">
      <a @click="goto(last)">{{last}}</a>
    </li>

    <li class="adap-pagination__next">
      <a @click="next">
        <i class="icon icon-arrow-right"></i>
      </a>
    </li>
  </ul>
`

import { Component, Prop, Vue } from 'vue-property-decorator'
import { PageCollection, IResource } from '@simpli/resource-collection'
import AdapTableWrapper from './index'

@Component({ template })
export class AdapPagination extends Vue {
  @Prop({ required: true })
  collection!: PageCollection<IResource>

  @Prop({ type: Number, default: 2 })
  gap!: number

  get first() {
    return 1
  }

  get current() {
    return (this.collection.currentPage || 0) + 1
  }

  get last() {
    return this.collection.lastPage + 1
  }

  async goto(n: number) {
    const options = AdapTableWrapper.options

    try {
      this.$emit('beforeGoto')

      if (options.defaultBeforeQueryAction) {
        options.defaultBeforeQueryAction()
      }

      await this.collection.queryCurrentPage(n - 1)

      this.$emit('afterGoto')

      if (options.defaultAfterQueryAction) {
        options.defaultAfterQueryAction()
      }
    } catch (e) {
      this.$emit('errorGoto')

      if (options.defaultErrorQueryAction) {
        options.defaultErrorQueryAction()
      }

      throw e
    }
  }

  async next() {
    const options = AdapTableWrapper.options

    try {
      this.$emit('beforeNext')

      if (options.defaultBeforeQueryAction) {
        options.defaultBeforeQueryAction()
      }

      await this.collection.queryNextPage()

      this.$emit('afterNext')

      if (options.defaultAfterQueryAction) {
        options.defaultAfterQueryAction()
      }
    } catch (e) {
      this.$emit('errorNext')

      if (options.defaultErrorQueryAction) {
        options.defaultErrorQueryAction()
      }

      throw e
    }
  }

  async prev() {
    const options = AdapTableWrapper.options

    try {
      this.$emit('beforePrev')

      if (options.defaultBeforeQueryAction) {
        options.defaultBeforeQueryAction()
      }

      await this.collection.queryPrevPage()

      this.$emit('afterPrev')

      if (options.defaultAfterQueryAction) {
        options.defaultAfterQueryAction()
      }
    } catch (e) {
      this.$emit('errorPrev')

      if (options.defaultErrorQueryAction) {
        options.defaultErrorQueryAction()
      }

      throw e
    }
  }

  index(n: number) {
    let pos = this.current

    if (this.current < 1 + this.gap) {
      pos = 1 + this.gap
    } else if (this.current > this.last - this.gap) {
      pos = this.last - this.gap
    }

    return n + pos - this.gap - 1
  }
}
