import {TiTick} from 'react-icons/ti'

const UploadSongSuccessfull = () => {
    return (
        <div >
            <div className="bg-grey_bg flex flex-col items-center justify-center py-10 w-full ">
      <TiTick className="text-green-500 flex" size={400} />
      <p className='flex text-white pb-20'>Uploaded Song Successfully</p>
    </div>
           
        </div>
    )
};
export default UploadSongSuccessfull;