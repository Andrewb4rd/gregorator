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
