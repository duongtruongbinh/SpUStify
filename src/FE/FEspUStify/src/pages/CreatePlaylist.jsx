const CreatePlaylist = () => {
  return (
    <div className="bg-[#2F303A] w-[70%] h-[80%] rounded-2xl mt-16 ml-44">
      <p className="flex items-center justify-center p-16 text-[#FFFFFF] text-2xl">
        Create playlist
      </p>

      <div className="flex space-x-16 items-center justify-center">
        <div className="h-48 w-48 flex items-center justify-center border-dashed border-2 border-[#AEAEAE]">
          <input type="file" name="uploadfile" id="img" className="hidden" />
          <label for="img" className="text-[#FAF6F6]">
            Image
          </label>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-[#FAF6F6]">Playlist name</div>
          <input
            type="text"
            name="uploadfile"
            className="bg-[#202027] w-80 rounded"
          />
        </div>
      </div>

      <div className="flex items-end pt-[6.2rem] pr-2 justify-end">
        <button
          type="button"
          class="text-[#FFFFFF] bg-[#636669] hover:bg-[#2d2e2f] font-medium rounded-lg text-sm px-8 py-2.5 mr-2 mb-2">
          Cancel
        </button>
        <button
          type="button"
          class="text-[#FFFFFF] bg-[#5291CC] hover:bg-[#20517f] font-medium rounded-lg text-sm px-8 py-2.5 mr-2 mb-2">
          Create
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;
