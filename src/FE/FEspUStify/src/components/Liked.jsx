import { FcLike} from 'react-icons/fc';
import React from 'react';

const Liked = ({handleLike}) => {
    return (
<FcLike className='cursor-pointer' size = {30} style={{ color: 'red' }}  onClick={handleLike} />
    );
};
export default Liked;
