import React from 'react';
import './book.css';

export function Book({ book }) {
  const { useEffect, useState } = React;

  const [bookData, setBook] = useState(book);
  const [coverImage, setCoverImage] = useState(`https://covers.openlibrary.org/b/id/${book?.cover_i}-M.jpg`);
  // https://covers.openlibrary.org/b/id/9255566.jpg
  // const getCoverImage = () => {
  //   const imageUrl = `https://covers.openlibrary.org/b/id/${bookData?.cover_i}-M.jpg`;
  //   console.log(imageUrl);
  //   setCoverImage(imageUrl);
  // }
  // useEffect(getCoverImage, [bookData])
  return (
    <div className='grid-container'>
      <img  className='cover-image' src={coverImage} />
      <div className='book-details'>
        <div className='book-title'>

        {bookData.title ?? 'not found...'}
        </div>
        <div className='author'>{bookData.author_name}</div>
      </div>
    </div>
  );
}
