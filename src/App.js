import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useAxios } from './hooks/useAxios';
import { Book } from './components/Book';
import { Pagination } from './components/Pagination'

function App() {
  const {useEffect, useState } = React;

  const baseUrl = 'https://openlibrary.org/search.json?q='
  const intialSearch = localStorage.getItem('searchText') ?? 'Lord of the Rings';
  const maxPerPage = 100;
  
  // state
  const [url, setUrl] = useState(baseUrl+intialSearch);
  const [searchText, setSearchText] = useState(intialSearch);
  const [page, setPage] = useState(Number(localStorage.getItem('page') ?? 1));
  const [{ data, isLoading, isError }, pingOpenLibrary] = useAxios(url);
  
  // hooks
  useEffect(() => {
    console.log('Search Text Effect: '+ searchText);
    setUrl(`${baseUrl}${searchText.replaceAll(' ','+')}&page=${page}`);
    localStorage.setItem('searchText',searchText);
  },[searchText]);

  useEffect(() => {
    console.log('Page Effect: '+ page);
    let newUrl = `${baseUrl}${searchText.replaceAll(' ','+')}&page=${page}`
    setUrl(newUrl);
    refreshQuery(newUrl);
    localStorage.setItem('page',page);

  },[page]);

  // useEffect(() => {
  //   if(isLoading || isError || !data?.docs?.length) return;

  //   const isbns = data?.docs
  //     .map(x => x.isbn)
  //     .flat()
  //     .filter(x => x?.length > 1)
  //     .join(',');
  //   console.log(isbns);
  //   if (!isbns?.length) return;
  //   let url = goodReadsUrl+isbns;
  //   pingGoogdReads(url);
  // },[isLoading]);





  // const goodReadsUrl = 'https://www.goodreads.com/book/review_counts.json?isbns='
  // const [{ goodReadsData, goodReadsLoading, goodReadsError }, pingGoogdReads] = useAxios();
  // useEffect(() => {
  //   if(goodReadsLoading || !goodReadsData?.book?.length) return;
  //   console.log(goodReadsData);
  // },[goodReadsLoading])


  // event handlers
  const handleChange = (e) => setSearchText(e.target.value)
  const handleSearch = (e) => {
    e?.preventDefault();

    console.log(`Sumbit: ${searchText}`)
    
    // we need to reset pagination if the user navigated alogn
    // however, changing pagination will trigger a fetch.
    // To resolve calling the fetch twice (once for changing page and once for search)
    // the logic below selectively executes the search;
    const quearyFunction = () => 
    (page !== 1) ? setPage(1) : refreshQuery(url);

    quearyFunction();
  }
  const handlePagination = (e) => setPage(e);
  
  // auxilliary functions
  const refreshQuery = (url) => {
    console.log(url);
    pingOpenLibrary(url);
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


