import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function BannerCard() {

  const [bannerCard, setBannerCard] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className='mt-10 rounded-2xl backdrop-blur-sm'>
      {/*  
        TODO: improve UX/UI 
        Put the center image, more static.
        fix font-size, align items, try to make it more clear and minimal.

        readme: XD || PS background
      */}
      Banner Card
    </div>
  );
}