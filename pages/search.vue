<template>
  <search-base
    :size="30"
    :provider="providerFunction">
    <template #filters>
      <search-terms-aggregation name="categories" nestedPath="categories" field="categories.name" title="Categories" :aggregationQuery="categoryQuery" url-param="category"></search-terms-aggregation>
      <search-terms-aggregation name="name" field="name" title="Name" url-param="name"></search-terms-aggregation>
      <search-terms-aggregation name="manufacturer" field="manufacturer.name" title="manufacturer" url-param="manufacturer"></search-terms-aggregation>
    </template>
    <template #header>
      <search-selected-filters></search-selected-filters>
    </template>
    <template #items="{items}">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
        <ProductHit v-for="item in items" :key="item.id" :product="item" :inline="false">
        </ProductHit>
      </div>
    </template>
  </search-base>
</template>
<script lang="ts">
import  ProductHit from '~/components/product/ProductHit.vue';
import { Product } from '~/models/Product';
import SearchSelectedFilters from '~~/components/search/SearchSelectedFilters.vue';
import SearchBaseVue from '~~/components/search/SearchBase.vue';
import SearchTermsAggregation from '~~/components/search/SearchTermsAggregation.vue';
import { BoolQuery, TermQuery } from 'elastic-builder';

export default {
  layout: "default",
  components: {
    ProductHit,
    'search-base': SearchBaseVue,
    'search-terms-aggregation': SearchTermsAggregation,
    'search-selected-filters': SearchSelectedFilters
  },
  data() {
    return {
      layout: 'grid',
      facets: {
        name: [],
        url: []
      }
    }
  },
  methods: {
    transformResult(result:any) {
      return result?.hits?.hits?.map((data:any) => new Product(data._source))

    },
    providerFunction(body) {
      const services = useShopinvaderServices()
      return services.products.search(body)
    },
    categoryQuery(query:BoolQuery, field:string, name:string) {
      if (query !== null) {
        query.must(new TermQuery('categories.level', '0'))
      } else {
        query = new BoolQuery().must(new TermQuery('categories.level', '0'))
      }

      return query
    }
  },
  async setup() {
  }
}
</script>
