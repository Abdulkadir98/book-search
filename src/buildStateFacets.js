function getValueFacet(aggregations, fieldName) {
    if (
      aggregations &&
      aggregations[fieldName] &&
      aggregations[fieldName].buckets &&
      aggregations[fieldName].buckets.length > 0
    ) {
      return [
        {
          field: fieldName,
          type: "value",
          data: aggregations[fieldName].buckets.map(bucket => ({
            // Boolean values and date values require using `key_as_string`
            value: bucket.key_as_string || bucket.key,
            count: bucket.doc_count
          }))
        }
      ];
    }
  }


export default function buildStateFacets(aggregations) {
    const filterBy = getValueFacet(aggregations, "filterBy");
  
    const facets = {
      ...(filterBy && { filterBy })
    };
  
    if (Object.keys(facets).length > 0) {
      return facets;
    }
  }