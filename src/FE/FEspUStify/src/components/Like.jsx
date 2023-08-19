import { BsHeart } from 'react-icons/bs';
import React from 'react';

const Like = ({handleLike}) => {
    return (
<BsHeart className='cursor-pointer' size = {30} style={{ color: 'white' }}  onClick={handleLike} />
    );
};
export default Like;
