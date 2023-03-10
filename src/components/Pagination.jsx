import React from 'react';
import './pagination.css';

export function Pagination({perPage, total, onPageChange, current}) {
    const { useEffect, useState } = React;
    const [showTextEntry, setShowTextEntry] = useState(-1);
    const [goTo, setGoTo] = useState(-1);
    const [currentPage, setCurrentPage] = useState(current);

    const pageCount = Math.ceil(total/perPage);
    const maxPagination = 9;
    
    function getTrimmedPagination(pageArray) {
        // get the amount typically on the left and the right
        // divide by 2 to get the center
        // subtract 2 to account for the fisrt and last
        let dynamicPageCount = Math.floor((maxPagination-2)/2)

        let start = 
            (currentPage <= maxPagination - dynamicPageCount - 1) 
            ? 1
            
            : (currentPage > (pageCount - dynamicPageCount)) 
            ? pageCount - maxPagination + 1
            
            : currentPage - dynamicPageCount - 1;

        let end = 
            (currentPage <= dynamicPageCount + 1) 
            ? maxPagination - 1
            
            : (currentPage > (pageCount - dynamicPageCount)) 
            ? pageCount - 1
            
            : currentPage + dynamicPageCount;
        
        console.log(`start: ${start}, end: ${end}`);
        return [pageArray[0], ...pageArray.slice(start,end), pageArray[pageCount-1]];
    }

    function getPages() {
        const pageArray = Array.from({length: pageCount}, (_, i) => {
            let pageObj = {
                    page: (i + 1),
                    start: (i * perPage + 1)
                }
            return pageObj;
            });
        
        const trimmedPageArray = pageArray.length > maxPagination 
            ? getTrimmedPagination(pageArray)
            : pageArray;
        console.log(`Pagination.GetPages(): ${trimmedPageArray}`);
        return trimmedPageArray;
    }
    const [pages, setPages] = useState(() => getPages());

    function handleClick(pageNumber) {
        console.log(`Pagination Click: ${pageNumber}`);
        setCurrentPage(pageNumber)
        onPageChange(pageNumber);
    }

    function handleEllipsesClick(e,i) {
        console.log(i);
        setShowTextEntry(i);
        e.target.focus();
    }
    function handleEllispesSubmit(e) {
        if(!(e.key === 'Enter' || e.keyCode === 13)) return;
        if(goTo < 1 || goTo > pageCount) return;
        setCurrentPage(Number(goTo))
        onPageChange(Number(goTo));
        setShowTextEntry(!showTextEntry);
    }
    function toggleEllipses(e){
        setShowTextEntry(-1);
    }

    useEffect(() => {
        setPages(getPages());
    },[currentPage])
    return (
        <div className="pagination">
            <button 
                onClick={() => handleClick(currentPage-1)} 
                disabled={currentPage === 1}
            >&lt;&lt;</button>
            {pages.map(
                (x,i) => 
                <>
                {(i !== 0 && (x.page - pages[i-1].page) > 1) 
                    ? showTextEntry === i
                        ? <input 
                            autoFocus={true}
                            className='ellipses-input'
                            type="number" 
                            onChange={(e) => setGoTo(e.target.value)}
                            onBlur={toggleEllipses}
                            onKeyDown={handleEllispesSubmit}
                          ></input>
                        : <small onClick={(e) => handleEllipsesClick(e,i)}>...</small> 
                    : null}
                <button 
                    key={x.start}
                    onClick={() => handleClick(x.page)}
                    disabled={x.page === currentPage}
                    >{x.page}</button>
                </>
            )}
            <button  
                onClick={() => handleClick(currentPage+1)} 
                disabled={pageCount == currentPage}
            >&gt;&gt;</button>
        </div>
    )
}