import buildStateFacets from "./buildStateFacets";


function buildTotalPages(resultsPerPage, totalResults) {
  if (!resultsPerPage) return 0;
  if (totalResults === 0) return 1;
  return Math.ceil(totalResults / resultsPerPage);
}

function buildTotalResults(hits) {
  return hits.total.value;
}

function getHighlight(hit, fieldName) {
  
  if (
    !hit.highlight ||
    !hit.highlight[fieldName] ||
    hit.highlight[fieldName].length < 1
  ) {
    return;
  }

  return hit.highlight[fieldName][0];
}


function buildResults(hits) {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value
  });

  const toObject = (value, snippet) => {
    return { raw: value, ...(snippet && { snippet }) };
  };

  return hits.map(record => {
    return Object.entries(record._source)
    // Include "text" field only if there is an highlight for it (for phrase queries)
      .filter(([fieldName, fieldValue]) => (fieldName !== "text" || getHighlight(record, fieldName))) 
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObject(fieldValue, getHighlight(record, fieldName))
      ])
      .reduce(addEachKeyValueToObject, {});
  });
}


export default function buildState(response, resultsPerPage) {
  console.log(response.hits.hits)
    const results = buildResults(response.hits.hits);
    const totalResults = buildTotalResults(response.hits);
    const totalPages = buildTotalPages(resultsPerPage, totalResults);
    const facets = {  
          filterBy: [
            {
              field: "filterBy",
              type: "value",
              data: [
                {value: "Author", count: 0},
                {value: "Title", count: 0}
              ] 
            }
          ]
        };
  
    return {
      results,
      totalPages,
      totalResults,
      facets
    };
  }