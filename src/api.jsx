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
  console.log(details)
  return baseApi.post(`/video/${id}`, details).then((response) => {
    return response.data;
  });
};

export const viewVideo = (id) => {
  return baseApi.put(`/video/${id}`).then((response) => {
    return response.data;
  });
};