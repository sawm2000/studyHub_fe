import axios from "axios";

const baseApi = axios.create({
  baseURL: "https://studyhub-19l1.onrender.com",
});

export const getAllVideos = (searchQuery, tags, sortBy, orderBy) => {
  let endPointString = "/video";
  const queries = {
    search: searchQuery,
    tags,
    sortBy,
    orderBy,
  };

  return baseApi.get(endPointString, { params: queries }).then((response) => {
    return response.data.videos;
  });
};

export const getAllRooms = (searchQuery, isPrivate, sortBy, orderBy) => {
  let endPointString = "/room";
  const queries = {
    search: searchQuery,
    isPrivate,
    sortBy,
    orderBy,
  };
  return baseApi.get(endPointString, { params: queries }).then((response) => {
    return response.data;
  });
};

export const login = (details) => {
  return baseApi.post(`/user/signin`, details).then((response) => {
    return response.data;
  });
};

export const signup = (details) => {
  return baseApi.post(`/user/signup`, details).then((response) => {
    return response.data;
  });
};

export const getUser = (id) => {
  return baseApi.get(`/user/${id}`).then((response) => {
    return response.data;
  });
};

export const updateUser = (id, changes) => {
  return baseApi.put(`/user/${id}`, changes).then((response) => {
    return response.data;
  });
};

export const deleteUser = (id) => {
  return baseApi.delete(`/user/${id}`).then(() => {});
};

export const addVideo = (details, id) => {
  return baseApi.post(`/video/${id}`, details).then((response) => {
    return response.data;
  });
};

export const getVideo = (id) => {
  return baseApi.get(`/video/${id}`).then((response) => {
    return response.data;
  });
};

export const deleteVideo = (video_id, id) => {
  return baseApi.delete(`/video/${id}`, { data: video_id }).then(() => {});
};

export const likeVideo = (video_id, id) => {
  return baseApi.post(`/video/${id}/like`, video_id).then((response) => {
    return response.data;
  });
};

export const unlikeVideo = (video_id, id) => {
  return baseApi.post(`/video/${id}/unlike`, video_id).then((response) => {
    return response.data;
  });
};

export const getComments = (id) => {
  return baseApi.get(`/video/${id}/comment`).then((response) => {
    return response.data;
  });
};

export const addComment = (video_id, id) => {
  return baseApi.post(`/video/${id}/comment`, video_id).then((response) => {
    return response.data;
  });
};

export const deleteComment = (video_id, id) => {
  return baseApi.delete(`/video/${id}/comment`, { data: video_id }).then((response) => {
    return response.data;
  });
};