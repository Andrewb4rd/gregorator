import React, { useEffect, useState } from "react";
import "../styles/Body.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import {
  postNewLink,
  getAllLinks,
  updateClickCount,
  getLinksByTag,
  getAllTags,
} from "../api/index";

const Body = ({ tags, links, setLinks, setTags }) => {
  const [menuHtml, setMenuHtml] = useState([]);
  const [posts, setPosts] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [newPost, setNewPost] = useState({});

  const onShareClick = async () => {
    let formalDate = new Date();
    let month = formalDate.getMonth() + 1;
    let day = formalDate.getDate();
    let year = formalDate.getFullYear();
    let casualDate =
      month.toString() + "/" + day.toString() + "/" + year.toString();
    newPost.date = casualDate;
    const result = await postNewLink(newPost);
    if (result.name) {
      if (result.message === "Cannot read property 'id' of undefined") {
        alert(
          "This Link has already been posted. Please use a different Link."
        );
      } else {
        alert("Unknown error");
      }
    } else {
      updateLinks();
      setModalShow(false);
    }
  };

  const onDescriptionChange = (e) => {
    newPost.comment = e.target.value;
  };

  const onUrlChange = (e) => {
    newPost.url = e.target.value;
  };

  const onTagsChange = (e) => {
    newPost.tags = e.target.value;
  };

  async function updateLinks() {
    try {
      const linksArr = await getAllLinks();
      const tagsArr = await getAllTags();
      setLinks(linksArr);
      setTags(tagsArr);
    } catch (error) {
      throw error;
    }
  }

  function ShareLinkModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Share a Link
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" onChange={onDescriptionChange} />
            <Form.Label>URL</Form.Label>
            <Form.Control type="url" onChange={onUrlChange} />
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" onChange={onTagsChange} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onShareClick}>Share</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  async function sortByTag(tag) {
    try {
      const result = await getLinksByTag(tag);
      setLinks(result.links);
    } catch (error) {
      throw error;
    }
  }

  async function sortByPopularity() {
    try {
      const result = await getAllLinks();
      const sortedPosts = result.sort((a, b) => b.clickcount - a.clickcount);
      setLinks(sortedPosts);
    } catch (error) {
      throw error;
    }
  }

  async function sortByDate() {
    try {
      const result = await getAllLinks();
      const sortedPosts = result.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setLinks(sortedPosts);
    } catch (error) {
      throw error;
    }
  }

  const renderLinkTags = (tags) => {
    const tagArray = [];
    tags.forEach((tag, idx) => {
      tagArray.push(
        <Button
          variant="light"
          onClick={() => {
            sortByTag(tag.name);
          }}
          className="postTag"
          key={idx}
        >
          {tag.name}
        </Button>
      );
    });
    return tagArray;
  };

  const countLinkClick = async (val) => {
    try {
      await updateClickCount(val);
      updateLinks();
    } catch (error) {
      throw error;
    }
  };

  const renderLinks = () => {
    if (links.length) {
      const postsArray = [];
      links.forEach((link, idx) => {
        const post = (
          <Row className="cardRow" key={idx}>
            <Card style={{ width: "47.5rem" }}>
              <Card.Body className="cardBody">
                <Card.Title>{link.comment}</Card.Title>
                <Card.Link
                  href={link.url}
                  onClick={() => countLinkClick(link.id)}
                  target="_blank"
                >
                  {link.url} <p hidden>{link.id}</p>
                </Card.Link>
                <Row className="tagRow">{renderLinkTags(link.tags)}</Row>
                <Row className="clickTracker">
                  <Card.Text>
                    {link.clickcount} clicks since {link.date}
                  </Card.Text>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        );
        postsArray.push(post);
      });
      setPosts(postsArray);
    }
  };

  const populateTagOptions = () => {
    if (tags.length) {
      const elementsArray = [];

      tags.forEach((tag, idx) => {
        const dropDownElement = (
          <Dropdown.Item
            key={idx}
            onClick={() => {
              sortByTag(tag.name);
            }}
          >
            {tag.name}
          </Dropdown.Item>
        );
        elementsArray.push(dropDownElement);
      });

      setMenuHtml(elementsArray);
    }
  };

  useEffect(() => {
    populateTagOptions();
  }, [tags]);

  useEffect(() => {
    renderLinks();
  }, [links]);

  return (
    <Container fluid className="bodyContainer">
      <Row className="bodyRow1">
        <Form>
          <Form.Control
            size="lg"
            type="search"
            as="button"
            onClick={(e) => {
              e.preventDefault();
              setModalShow(true);
            }}
          >
            Share a Link...
          </Form.Control>
        </Form>
      </Row>
      <Row className="bodyRow2">
        <Container fluid className="sortByContainer">
          <Col className="sortCol1">
            <Button variant="light" onClick={sortByPopularity}>
              Most Popular
            </Button>
            <Button variant="light" onClick={updateLinks}>
              All
            </Button>
            <Button variant="light" onClick={sortByDate}>
              Newest
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                Tags
              </Dropdown.Toggle>

              <Dropdown.Menu>{menuHtml}</Dropdown.Menu>
            </Dropdown>
          </Col>
        </Container>
      </Row>
      {posts}
      <ShareLinkModal
        show={modalShow}
        animation={false}
        backdrop="static"
        onHide={() => setModalShow(false)}
      />
    </Container>
  );
};

export default Body;
