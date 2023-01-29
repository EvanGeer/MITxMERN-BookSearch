import React from 'react';
import axios from 'axios';
import { dataReducer } from "./dataReducer";

// import { useState } from 'react/cjs/react.production.min';
export function useAxios(initialUrl) {
  // static constants
  const { useState, useEffect, useReducer } = React;

  // state
  const [url, setUrl] = useState(initialUrl);
  const fetch = (newUrl) => {
    console.log(`Re-Render useAxios: ${newUrl}`);
    setUrl(newUrl);
  };

  const [state, dispatch] = useReducer(dataReducer, {
    isLoading: false,
    isError: false,
    data: [],
  });

  useEffect(() => {
    console.log('Url Changed: '+url);
    let didCancel = false;
    const getData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      if (didCancel) {
        console.log('Cancelled');
        return;
      }
      try {
        const result = await axios(url);
        if (!didCancel) {
          console.log(result?.data);
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: result?.data
          });
        }
      } catch (er) {
        if (!didCancel) {
          console.error(er);
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
