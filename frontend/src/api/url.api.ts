import api from "../utils/axios";

export interface UserLink {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
}

interface LinksResponse {
  links: UserLink[];
}

interface ShortenResponse {
  shortUrl: string;
}

export const shortenUrl = async (url: string) => {
  const response = await api.post<ShortenResponse>("/api/shorten", { url });

  return response.data.shortUrl;
};

export const getMyLinks = async () => {
  const response = await api.get<LinksResponse>("/api/my/links");

  return response.data.links;
};

export const deleteLink = async (code: string) => {
  await api.delete(`/api/my/links/${code}`);
};
