import { useState } from "react";
import { useAddSongToPlaylistMutation } from "../redux/services/CoreApi";
const AddSongToPlaylist = ({songid,namePlaylist}) => {
const [setAddSongToPlaylist, isLoading] = useAddSongToPlaylistMutation();
    return (
<div></div>
    )
};
export default AddSongToPlaylist