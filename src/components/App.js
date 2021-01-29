import React, { useState, useEffect } from "react";
import Header from "./Header";
import Body from "./Body";
import { getAllTags, getAllLinks } from "../api/index";

import "../styles/App.css";

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

  useEffect(() => {
    console.log("Links: ", links);
  }, [links]);

  return (
    <div className="App">
      <Header />
      <Body tags={tags} links={links} />
    </div>
  );
};

export default App;
