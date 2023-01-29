import React from 'react';
import './pagination.css';

export function Pagination({perPage, total, onPageChange, current}) {
    const { useEffect, useState } = React;

    const pageCount = Math.ceil(total/perPage);
    const maxPagination = 9;
    
    function getTrimmedPagination(pageArray) {
        let start = 
            (current < maxPagination) 
            ? 1
            
            : (current > (pageCount - maxPagination)) 
            ? pageCount - maxPagination + 2
            
            : current-(Math.floor((maxPagination)/2));

        let end = 
            (current < maxPagination) 
            ? maxPagination - 2
            
            : (current > (pageCount - maxPagination)) 
            ? pageCount - 1
            
            : current+(Math.floor((maxPagination)/2));
        
        // start = Math.max(
        //     1,
        //     current-(Math.floor((maxPagination)/2))
        // );
        // let end = Math.min(
        //     pageCount-2, 
        //     start + maxPagination - 2
        // );
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
        console.log(trimmedPageArray);
        return trimmedPageArray;
    }
    const [pages, setPages] = useState(getPages());
    //     [
    //     {page:1, start:0},
    //     {page:2, start:100},
    //     {page:3, start:200},
    // ]);

    function handleClick(pageNumber) {
        console.log(`Pagination Click: ${pageNumber}`);
        onPageChange(pageNumber);

    }

    return (
        <div className="pagination">
            <button 
                onClick={() => handleClick(current-1)} 
                disabled={current === 1}
            >&lt;&lt;</button>
            {pages.map(
                (x,i) => 
                <>
                {(i !== 0 && (x.page - pages[i-1].page) > 1) ? <>...</> : null}
                <button 
                    key={x.start}
                    onClick={() => handleClick(x.page)}
                    disabled={x.page === current}
                    >{x.page}</button>
                </>
            )}
            <button  
                onClick={() => handleClick(current+1)} 
                disabled={pageCount == current}
            >&gt;&gt;</button>
        </div>
    )
}