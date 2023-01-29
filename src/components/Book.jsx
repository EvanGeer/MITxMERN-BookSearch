import starImage from '../assets/star.png';
import halfStarImage from '../assets/half-star.png';
import React from 'react';
import { useAxios } from '../hooks/useAxios';
import './book.css';

const getAmazonImgUrls = (book) => {
  let urls = book?.id_amazon?.filter(x => x?.length > 1)?.map(x => {
      let imgSrc = `//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${x}&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=evangeer-20&language=en_US`;
      let hrefUrl = `https://www.amazon.com/dp/${x}?&linkCode=ll1&tag=evangeer-20&linkId=65c644c8c93f704026ee57deb7edd761&language=en_US&ref_=as_li_ss_tl`
      return {imgSrc, hrefUrl};
    });
  return urls;
}

const getFirstAmazonImg = (book) => {
  let urls = getAmazonImgUrls(book);
  return urls?.[0]?.imgSrc;
}

function RatingStars({ratingData}) {
  const { useEffect, useState } = React;
  const [rating, setRating] = useState(ratingData);

  // const [roundedRating, setRoundedRating] = useState(Math.round(rating*2)/2);
  function getStars(rating) {
    console.log(`rating: ${rating}`);
    let roundedRating = Math.round(rating*2)/2;
    let halfStar = roundedRating % 2 > 0;
    let starCount = Math.ceil(roundedRating);
    console.log(starCount)
    let stars = <>
      {Array.from({length: Math.ceil(roundedRating)}, (_, i) => {
        return <img key={i} className='star' src={halfStar && i === starCount - 1 ? halfStarImage : starImage}/>
      })}
      </>
      //{`star ${ ' half' : ''}`}
    // let stars = 
    //   <>
    //     <img className={`star ${halfStar ? ' half' : ''}`} src='./star.png'/>
    //     <img className={`star ${halfStar ? ' half' : ''}`} src='./star.png'/>
    //     <img className={`star ${halfStar ? ' half' : ''}`} src='./star.png'/>
    //   </>
    return stars;
  }

  return (
    <div className='scroll-box'>
      {getStars(rating)}

    </div>
  )
}

export function Book({ book }) {
  const { useEffect, useState } = React;


  const [bookData, setBook] = useState(book);
  const [coverImage, setCoverImage] = useState((book?.cover_i)
      ? `https://covers.openlibrary.org/b/id/${book?.cover_i}-M.jpg`
      : getFirstAmazonImg(book)
    );

    const getRatingsUrl = (x) => {
      let url =  `https://openlibrary.org${x}/ratings.json`;
      console.log(url);
      return url;
    }
    
  const [{ data: ratingsData, isLoading: ratingsLoading, isError }, getRatings] = useAxios(getRatingsUrl(book.key));

  const AmazonBooks = () => {
    bookData.id_amazon?.filter(x => x?.length > 1)?.map(x => 
      <div>
        <a href={`https://www.amazon.com/dp/${x}?&linkCode=ll1&tag=evangeer-20&linkId=65c644c8c93f704026ee57deb7edd761&language=en_US&ref_=as_li_ss_tl`}>
          {/* ... */}
          <img className='amazon' alt="removed..." border="0" src={`//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${x}&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=evangeer-20&language=en_US`} />
          <img className='amazon' src={`https://ir-na.amazon-adsystem.com/e/ir?t=evangeer-20&language=en_US&l=li2&o=1&a=${x}`} width="1" height="1" border="0" alt="" />
        </a>
      </div>
    )
  }
  
  return (
    <div className="grid-container">
      <img className="cover-image" src={coverImage} />
      <div className="book-details">
        <div className="book-title">{bookData.title ?? "not found..."}</div>
          {/* <RatingStars ratingData={2}/> */}
        <div className="author">Author: 
          <text className='detail'> {bookData.author_name} </text>
          {(bookData.first_publish_year)
          ? <><text className='detail'>[{bookData.first_publish_year}]</text></>
          : null
          }
        </div>
        { ratingsLoading ? <small>'loading reviews...'</small> :
        <div className="subhead">
          Ratings: {Math.round(ratingsData?.summary?.average*100)/100}&nbsp;
          <div className='detail'>({ratingsData?.summary?.count} reviews)</div> &nbsp;
          <RatingStars ratingData={ratingsData?.summary?.average}/>
        </div>
        }
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
        <div className='scroll-box'>{
          getAmazonImgUrls(bookData)?.map((x) => 
            <div>
              <a href={x.hrefUrl}>
                <img className='amazon' border="0" src={x.imgSrc} />
              </a>
            </div>
          )
        }</div>

      </div>
    </div>
  );
}
