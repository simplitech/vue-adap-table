import { Component, Watch, Vue } from 'vue-property-decorator'
import { IQueryRouter } from './IQueryRouter'
import { PageCollection } from '@simpli/resource-collection'

@Component
export class MixinAdapRoute extends Vue {
  private informedCollection: PageCollection<any> | null = null

  initAdapRoute(collection: PageCollection<any>) {
    this.informedCollection = collection
  }

  async query(query?: IQueryRouter): Promise<any> {
    // @ts-ignore
    const { q, page, order, asc } = query || (this.$route.query as IQueryRouter)
    const { informedCollection } = this

    if (!informedCollection) return null

    informedCollection
      .setSearch(q || '')
      .setCurrentPage((Number(page) || 1) - 1)
      .setOrderBy(order || '')
      .setAsc(asc !== undefined ? !!Number(asc) : true)

    return await informedCollection.queryAsPage()
  }

  @Watch('informedCollection.search')
  private async querySearchEvent(querySearch?: string) {
    // @ts-ignore
    const query = { ...this.$route.query }

    if (querySearch) query.q = `${querySearch}`
    else delete query.q

    try {
      // @ts-ignore
      await this.$router.replace({ query })
    } catch (e) {
      /**/
    }
  }

  @Watch('informedCollection.currentPage')
  private async currentPageEvent(currentPage?: number) {
    // @ts-ignore
    const query = { ...this.$route.query }

    if (currentPage) query.page = `${currentPage + 1}`
    else delete query.page

    try {
      // @ts-ignore
      await this.$router.replace({ query })
    } catch (e) {
      /**/
    }
  }

  @Watch('informedCollection.orderBy')
  private async orderByEvent(orderBy?: string) {
    // @ts-ignore
    const query = { ...this.$route.query }
    const asc = this.informedCollection ? this.informedCollection.asc : false

    if (orderBy) {
      query.order = `${orderBy}`
      query.asc = `${asc ? 1 : 0}`
    } else {
      delete query.order
      delete query.asc
    }

    try {
      // @ts-ignore
      await this.$router.replace({ query })
    } catch (e) {
      /**/
    }
  }

  @Watch('informedCollection.asc')
  private async ascEvent(asc?: boolean) {
    // @ts-ignore
    const query = { ...this.$route.query }
    const orderBy = this.informedCollection ? this.informedCollection.orderBy : ''

    if (orderBy) {
      query.asc = `${asc ? 1 : 0}`
    } else {
      delete query.asc
    }

    try {
      // @ts-ignore
      await this.$router.replace({ query })
    } catch (e) {
      /**/
    }
  }
}
