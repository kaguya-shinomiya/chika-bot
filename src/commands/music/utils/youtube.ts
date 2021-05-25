import axios from "axios";

const YOUTUBE_URL_ID_RE = /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/;

export const getVideoByLink = (link: string) => {
  const vid = link.match(YOUTUBE_URL_ID_RE)![1];
  return axios
    .get("https://youtube.googleapis.com/youtube/v3/videos", {
      params: { part: "snippet", id: vid, key: process.env.YOUTUBE_API_KEY },
    })
    .then((response) => response.data);
};

export const searchOneVideo = (title: string) =>
  axios
    .get("https://youtube.googleapis.com/youtube/v3/search", {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: title,
        maxResults: 1,
      },
    })
    .then((response) => response.data);
