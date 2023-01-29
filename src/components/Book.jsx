import React from 'react';
import { useAxios } from '../hooks/useAxios';
import './book.css';

export function Book({ book }) {
  const { useEffect, useState } = React;

  const [bookData, setBook] = useState(book);
  const [coverImage, setCoverImage] = useState(`https://covers.openlibrary.org/b/id/${book?.cover_i}-M.jpg`);

  // const [goodReads, setGoodReads] = useState();

  // const isbns = book.isbn?.filter(x => x.length>1).join(',');
  // const goodReadsUrl = 'https://www.goodreads.com/book/review_counts.json?isbns='
  // const [{ goodReadsData, goodReadsLoading, goodReadsError }, pingAxios] = useAxios(baseUrl+isbns);
  
  return (
    <div className="grid-container">
      <img className="cover-image" src={coverImage} />
      <div className="book-details">
        <div className="book-title">{bookData.title ?? "not found..."}</div>
        <div className="author">Author: {bookData.author_name}</div>
        {
          // isLoading 
          //   ? <>...</> : 
          //   <>
          //     {goodReadsData?.books?.reduce((runningTotal, current)=>runningTotal+=current)} reviews
          //   </>
        }
        <div className='subhead'>
          Subjects:&nbsp;
          <div className='detail'>{book.subject?.some(x => x) ? book.subject.join(', ') : 'none found...'}</div>
        </div>
        <div className='subhead'>
          Setting:&nbsp;
          <div className='detail'>{book.place?.some(x => x) ? book.place.join(', ') : 'none found...'}</div>
        </div>
        <div className='subhead'>
          Characters:&nbsp;
          <div className='detail'>{book.person?.some(x => x) ? book.person.join(', ') : 'none found...'}</div>
        </div>
        <div className='subhead'>
          Available on Amazon:&nbsp;
          {bookData.id_amazon?.some(x => x?.length > 1) ? null :<div className='detail'>none found...</div>}
        </div>
        <div className='scroll-box'>
        {
          // bookData.id_amazon?.some(x => x?.length > 1) ?
          bookData.id_amazon?.filter(x => x?.length > 1)?.map(x => 
            <div>
              <a href={
                `https://www.amazon.com/dp/${x}?&linkCode=ll1&tag=evangeer-20&linkId=65c644c8c93f704026ee57deb7edd761&language=en_US&ref_=as_li_ss_tl`}>
                {/* ... */}
                <img border="0" src={`//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${x}&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=evangeer-20&language=en_US`} />
                <img src={`https://ir-na.amazon-adsystem.com/e/ir?t=evangeer-20&language=en_US&l=li2&o=1&a=${x}`} width="1" height="1" border="0" alt="" />
              </a>
            </div>
          )
        // : 
        
        }</div>

      </div>
    </div>
  );
}
