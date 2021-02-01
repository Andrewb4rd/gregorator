import axios from "axios";

export async function getAllTags() {
  try {
    const response = await axios.get("/api/tags");
    const { data } = await response;
    return data.tags;
  } catch (error) {
    throw error;
  }
}

export async function getAllLinks() {
  try {
    const response = await axios.get("/api/links");
    const { data } = await response;
    return data.links;
  } catch (error) {
    throw error;
  }
}

export async function postNewLink(link) {
  try {
    const response = await axios.post("/api/links", link);
    const { data } = await response;
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateClickCount(id) {
  try {
    const response = await axios.patch(`/api/links/${id}`);
    const { data } = await response;
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLinksByTag(tag) {
  try {
    const response = await axios.get(`/api/tags/${tag}/links`);
    const { data } = await response;
    return data;
  } catch (error) {
    throw error;
  }
}
