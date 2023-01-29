import starImage from '../assets/star.png';
import halfStarImage from '../assets/half-star.png';
import React from 'react';

export function RatingStars({ ratingData }) {
  const { useEffect, useState } = React;
  const [rating, setRating] = useState(ratingData);

  function getStars(rating) {
    // console.log(`rating: ${rating}`);
    let roundedRating = Math.round(rating * 2) / 2;
    let halfStar = roundedRating % 2 > 0;
    let starCount = Math.ceil(roundedRating);
    // console.log(starCount);

    let stars = <>
      {Array.from({ length: Math.ceil(roundedRating) }, (_, i) => {
        return <img key={i} className='star' src={halfStar && i === starCount - 1 ? halfStarImage : starImage} />;
      })}
    </>;

    return stars;
  }

  return (
    <div className='scroll-box'>
      {getStars(rating)}

    </div>
  );
}
