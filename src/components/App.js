import React, { useState, useEffect } from "react";
import Header from "./Header";
import Body from "./Body";
import { getAllTags, getAllLinks } from "../api/index";

const App = () => {
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);

  async function initializeTags() {
    const tagArray = await getAllTags();
    setTags(tagArray);
  }

  async function initializeLinks() {
    const linkArray = await getAllLinks();
    setLinks(linkArray);
  }

  useEffect(() => {
    if (tags.length < 1) {
      initializeTags();
    }
  }, []);

  useEffect(() => {
    if (links.length < 1) {
      initializeLinks();
    }
  }, []);

  return (
    <div className="App">
      <Header setLinks={setLinks} />
      <Body tags={tags} setTags={setTags} links={links} setLinks={setLinks} />
    </div>
  );
};

export default App;
