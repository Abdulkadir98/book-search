import React from "react";

import { 
        SearchProvider, 
        Results,
        WithSearch, 
        SearchBox,
        Facet,
        PagingInfo,
        ResultsPerPage,
        Paging,
        ErrorBoundary,
        Sorting
        } from "@elastic/react-search-ui";

import { Layout, SingleSelectFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
import buildState from "./buildState";

import './App.css';

const config = {
  debug: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async ({ searchTerm }) => {
    const requestBody = buildRequest({ searchTerm });
    const json = await runRequest(requestBody);
    const state = buildState(json);
    return {
      autocompletedResults: state.results
    };
  },
  onSearch: async state => {
    const { resultsPerPage } = state;
    const requestBody = buildRequest(state);
    const responseBody = await runRequest(requestBody);
    return buildState(responseBody, resultsPerPage);
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
      {({ wasSearched }) => (
      <div className="App">
        <ErrorBoundary>
        <Layout
          header={<SearchBox inputProps={{ placeholder: "Author, Title, or your favorite 'Quote'" }}/>}
          sideContent={
            <div>
              <Facet
                field="filterBy"
                label="Filter By" 
                view={SingleSelectFacet}             
              />
            </div>
          }
          bodyContent={
          <Results 
          titleField="title" />
        }
        bodyHeader={
          <React.Fragment>
            {wasSearched && <PagingInfo />}
            {wasSearched && <ResultsPerPage />}
          </React.Fragment>
        }
        bodyFooter={<Paging />}
        />
        </ErrorBoundary>
      </div>
        )}
        </WithSearch>
    </SearchProvider>
  );
}

