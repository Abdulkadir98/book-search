import buildRequestFilter from "./buildRequestFilter";


function buildFrom(current, resultsPerPage) {
  if (!current || !resultsPerPage) return;
  return (current - 1) * resultsPerPage;
}

function buildMatch(searchTerm) {
    return searchTerm
      ? {
          multi_match: {
            query: searchTerm,
            fields: ["author", "title"]
          }
        }
      : { match_all: {} };
  }

/*
  Converts current application state to an Elasticsearch request.
  When implementing an onSearch Handler in Search UI, the handler needs to take the
  current state of the application and convert it to an API request.
  For instance, there is a "current" property in the application state that you receive
  in this handler. The "current" property represents the current page in pagination. This
  method converts our "current" property to Elasticsearch's "from" parameter.
  This "current" property is a "page" offset, while Elasticsearch's "from" parameter
  is a "item" offset. In other words, for a set of 100 results and a page size
  of 10, if our "current" value is "4", then the equivalent Elasticsearch "from" value
  would be "40". This method does that conversion.
  We then do similar things for searchTerm, filters, sort, etc.
*/
export default function buildRequest(state) {
    const {
      current,
      filters,
      resultsPerPage,
      searchTerm,
    } = state;
  
    const match = buildMatch(searchTerm);
    const size = resultsPerPage;
    const from = buildFrom(current, resultsPerPage);
    // const filter = buildRequestFilter(filters);


    // For exact phrase matching
    if(searchTerm.startsWith("'") && searchTerm.endsWith("'")) {
      return {
        highlight: {
          fragment_size: 200,
          number_of_fragments: 1,
          fields: {
            text: {},
          }
        },
        query: {
          query_string: {
            query: "\"" + searchTerm.substring(1, searchTerm.length) + "\""
          }
        },
        ...(size && { size }),
        ...(from && { from })
      }
    }

    if(filters && filters.length >= 1) {
      return {
        highlight: {
          fragment_size: 200,
          number_of_fragments: 1,
          fields: {
            [filters[0].values[0].toLowerCase()]: {},
          }
        },
          query: {
            match: {
              [filters[0].values[0].toLowerCase()]: searchTerm
            }
          }
        }
    }

    
    const body = {  
      highlight: {
        fragment_size: 200,
        number_of_fragments: 1,
        fields: {
          title: {},
          author: {},
        }
      },
      // Dynamic values based on current Search UI state
      // --------------------------
      // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/full-text-queries.html
      query: {
        bool: {
          must: [match],
        }
      },
      // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-from-size.html
      ...(size && { size }),
      ...(from && {from})
    };
    // debugger 
    return body;
  }