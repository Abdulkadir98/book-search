    function getTermFilter(filter) {
    
    if (filter.type === "all") {
      return {
        bool: {
          filter: filter.values.map(filterValue => ({
            term: filterValue.toLowerCase()
          }))
        }
      };
    }
  }

export default function buildRequestFilter(filters, searchTerm) {
    if (!filters) return;
  
    filters = filters.reduce((acc, filter) => {
      if ("filterBy".includes(filter.field)) {
        return [...acc, getTermFilter(filter)];
      }
      return acc;
    }, []);
  
    if (filters.length < 1) return;
    return filters;
  }