import React from 'react';
import axios from 'axios';
import { dataReducer } from "./dataReducer";

// import { useState } from 'react/cjs/react.production.min';
export function useAxios(initialUrl, verboseLogging = false, cacheResults = true) {
  // static constants
  const { useState, useEffect, useReducer } = React;

  const [resultsCache, setResultsCache] = useState({});

  // state
  const [url, setUrl] = useState(initialUrl);
  const fetch = (newUrl) => {
    if(verboseLogging) console.log(`Re-Render useAxios: ${newUrl}`);
    setUrl(newUrl);
  };

  const [state, dispatch] = useReducer(dataReducer, {
    isLoading: false,
    isError: false,
    data: [],
  });

  useEffect(() => {
    if(verboseLogging) console.log('Url Changed: '+url);
    let didCancel = false;
    const getData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      if (didCancel) {
        if(verboseLogging) console.log('Cancelled');
        return;
      }
      try {
        if (cacheResults && resultsCache[url]){
          if(verboseLogging) console.log(`retrieving cached data`);
          if(verboseLogging) console.log(resultsCache[url]);
          // if(verboseLogging) alert(resultsCache[url]);
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {...resultsCache[url]}
          });
          return;
        }

        const result = await axios(url);
        if (!didCancel) {
          if (cacheResults) {
            let newCache = 
              {...resultsCache};
              newCache[url] = result?.data
            
            setResultsCache(newCache)
          }
          if(verboseLogging) console.log(result?.data);
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: result?.data
          });
        }
      } catch (er) {
        if (!didCancel) {
          if(verboseLogging) console.error(er);
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    getData();
    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, fetch];
}
