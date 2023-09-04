import axios from "axios";
const getItemBySearch = async (keyword) => {
  try {
    const response = await axios
      .get(`http://127.0.0.1:8000/api/home/?query=${keyword}`, {
        // auth: {
        //   username: username,
        //   password: password,
        // },
      });
    return response;
  } catch (error) {
    return error;
  }
};
const getFavouriteSongs = async (username, password) => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/favourite/", {
        auth: {
          username: username,
          password: password,
        },
      });
    return response;
  } catch (error) {
    return error;
  }
};
const getTopChart = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/home/leaderboard/");
    return response;
  } catch (error) {
    return error;
  }
};
const getPlaylist = async (username, password) => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/playlists/",
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
    return response;
  } catch (error) {
    return error;
  }
};
const getPlaylistDetails = async (username, password, playlistid) => {
  try {
    const response = await axios
      .get(`http://localhost:8000/api/playlists/${playlistid}/`,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
    return response;
  } catch (error) {
    return error;
  }
};
const getSongDetails = async (username, password, songid) => {
  try {
    const response = await axios
      .get(`http://localhost:8000/api/songs/${songid}/`,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
    return response;
  } catch (error) {
    return error;
  }
};


const addSongToPlaylist = async (username, password, songid, playlistid) => {
  return axios

    .post(
      `http://localhost:8000/api/songs/${songid}/add-to-playlist/${playlistid}`,
      null,
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    .then((response) => response)
    .catch((error) => null);
};

const editAction = async (username, password, id, data, type) => {
  const typeURL = {
    playlist: `http://localhost:8000/api/playlists/${id}/edit/`,
    song: `http://localhost:8000/api/songs/${id}/edit/`,
  };
  try {
    const response = await axios
      .patch(typeURL[type], data, {
        auth: {
          username: username,
          password: password,
        },
      });
    return response;
  } catch (error) {
    return null;
  }
};

const likeAction = async (username, password, songID, type) => {
  const typeURL = {
    song: `http://localhost:8000/api/songs/${songID}/like/`,
  };
  try {
    const response = await axios
      .post(typeURL[type], null, {
        auth: {
          username: username,
          password: password,
        },
      });
    return response;
  } catch (error) {
    return null;
  }
};

const createAction = async (username, password, data, type) => {
  const typeURL = {
    playlist: "http://localhost:8000/api/playlists/create",
    song: "http://localhost:8000/api/songs/create",
  };
  try {
    const response = await axios
      .post(typeURL[type], data, {
        auth: {
          username: username,
          password: password,
        },
      });
    return response;
  } catch (error) {
    return null;
  }
};
const playSong = async (username, password, songid) => {
  try {
    const response = await axios
      .post(`http://localhost:8000/api/songs/${songid}/play/`, {
        auth: {
          username: username,
          password: password,
        },
      });
    return response;
  } catch (error) {
    return error;
  }
};
const Signin = async (data, username, password) => {

  try {
    const response = await axios
      .post("http://localhost:8000/api/login/", data, {
        auth: {
          username: username,
          password: password,
        },
      });
    return response;
  } catch (error) {
    return error;
  }
};
const Signup = async (data) => {

  try {
    const response = await axios
      .post("http://localhost:8000/api/register/", data);
    return response;
  } catch (error) {
    return error;
  }
};


export { likeAction, createAction, editAction, addSongToPlaylist, getFavouriteSongs, Signin, playSong, getTopChart, getPlaylist, getPlaylistDetails, Signup, getItemBySearch, getSongDetails };
