import axios from "axios";

const getFavouriteSongs = (username, password) => {
  return axios
    .get("http://localhost:8000/api/favourite/", {
      auth: {
        username: username,
        password: password,
      },
    })
    .then((response) => response)
    .catch((error) => null);
};

const addSongToPlaylist = (username, password, songid, playlistid) => {
  return axios
    .get()
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

const editAction = (username, password, id, data, type) => {
  const typeURL = {
    playlist: `http://localhost:8000/api/playlists/${id}/edit/`,
    song: `http://localhost:8000/api/songs/${id}/edit/`,
  };
  return axios
    .put(typeURL[type], data, {
      auth: {
        username: username,
        password: password,
      },
    })
    .then((response) => response)
    .catch((error) => null);
};

const likeAction = (username, password, songID, type) => {
  const typeURL = {
    song: `http://localhost:8000/api/songs/${songID}/like/`,
  };
  return axios
    .post(typeURL[type], null, {
      auth: {
        username: username,
        password: password,
      },
    })
    .then((response) => response)
    .catch((error) => null);
};

const createAction = (username, password, data, type) => {
  const typeURL = {
    playlist: "http://localhost:8000/api/playlists/create",
    song: "http://localhost:8000/api/songs/create",
  };
  return axios
    .post(typeURL[type], data, {
      auth: {
        username: username,
        password: password,
      },
    })
    .then((response) => response)
    .catch((error) => null);
};

export { likeAction, createAction, editAction, addSongToPlaylist };
