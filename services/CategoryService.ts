import { Category, CategoryResult } from '../models/Category';
import { ShopinvaderService, ElasticFetch } from '@shopinvader/services'


export class CategoryService extends ShopinvaderService {

  getProvider(): ElasticFetch | null {
    return this.providers?.['categories'] as ElasticFetch || null
  }

  async search(body: any): Promise<CategoryResult> {
    const provider = this.getProvider()
    if (provider == null) {
      throw new Error('No provider found for categories')
    }
    const result = await provider?.search(body)
    const hits = result?.hits?.hits?.map((hit: any) => this.jsonToModel(hit._source))
    const total = result?.hits?.total?.value || 0
    const aggregations = result?.aggregations || null
    return { hits, total, aggregations }
  }
  /**
   * 
   * @param field 
   * @param value 
   * @returns 
   */
  find(field: string, value: string[] | number[]): Promise<CategoryResult> {
    const terms: any = {}
    terms[field] = value
    const body = { query: { terms } }
    return this.search(body)
  }

  getByIds(ids: number[]): Promise<CategoryResult> {
    const body: any = {
      query: {
        terms: { id: ids }
      },
      size: ids.length
    }
    return this.search(body)
  }

  async getByURLKey(urlKey: string): Promise<Category | null> {
    const result: CategoryResult = await this.find('url_key', [urlKey])
    if (result?.hits?.length > 0) {
      return result?.hits?.[0]
    }
    return null
  }

  jsonToModel(json: any): Category {
    return new Category(json)
  }
}