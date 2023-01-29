import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useAxios } from './hooks/useAxios';
import { Book } from './components/Book';
import { Pagination } from './components/Pagination'

function App() {
  const {useEffect, useState } = React;

  const baseUrl = 'https://openlibrary.org/search.json?q='
  const intialSearch = 'Lord of the Rings'
  const maxPerPage = 100;
  
  // state
  const [url, setUrl] = useState(baseUrl+intialSearch);
  const [searchText, setSearchText] = useState(intialSearch);
  const [page, setPage] = useState(1);

  // hooks
  useEffect(() => {
    console.log('Search Text Effect: '+ searchText);
    setUrl(`${baseUrl}${searchText.replaceAll(' ','+')}&page=${page}`);
  },[searchText]);
  useEffect(() => {
    console.log('Page Effect: '+ page);

    let newUrl = `${baseUrl}${searchText.replaceAll(' ','+')}&page=${page}`
    setUrl(newUrl);
    refreshQuery(newUrl);
  },[page]);

  const [{ data, isLoading, isError }, pingAxios] = useAxios(url);

  // event handlers
  const handleChange = (e) => setSearchText(e.target.value)
  const handleSearch = (e) => {
    e?.preventDefault();

    console.log(`Sumbit: ${searchText}`)
    refreshQuery(url);
  }
  const handlePagination = (e) => setPage(e);
  
  // auxilliary functions
  const refreshQuery = (url) => {
    console.log(url);
    pingAxios(url);
    console.log('data:');
    console.log(data);
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSearch}>
          <input 
            type='text' 
            value={searchText}
            onChange={handleChange}
            />
          <button type='submit'>Go</button>
          </form>
          {isLoading ? 
            <div>
              <img src={logo} className="App-logo" alt="logo" /> 
            </div> : null}
          {data?.docs && !isLoading ?  (
            <div>
            Results: {data.numFound}
            {(data.numFound > maxPerPage) ?
              <div>
                <Pagination 
                  total={data.numFound} 
                  perPage={maxPerPage} 
                  onPageChange={handlePagination}
                  current={page}/>
              </div> 
            : null}
            {data.docs.map((doc) => {
              return <Book key={doc.key} book={doc}/>
            })}
            </div>
          )
          
          : null} 


      </header>
    </div>
  );
}

export default App;


