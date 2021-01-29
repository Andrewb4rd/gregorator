import React, { useEffect, useState } from "react";
import "../styles/Body.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Body = ({ tags, links }) => {
  const [menuHtml, setMenuHtml] = useState([]);
  const [posts, setPosts] = useState([]);

  const renderLinkTags = (tags) => {
    const tagArray = [];
    tags.forEach((tag) => {
      tagArray.push(
        <Button variant="light" className="postTag">
          {tag.name}
        </Button>
      );
    });
    return tagArray;
  };

  const renderLinks = () => {
    if (links.length) {
      const postsArray = [];

      links.forEach((link, idx) => {
        const post = (
          <Row className="cardRow">
            <Card style={{ width: "47.5rem" }}>
              <Card.Body className="cardBody">
                <Card.Title>{link.comment}</Card.Title>
                <Card.Link href={link.url}>{link.url}</Card.Link>
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
        let link = "#/action-" + idx;
        const dropDownElement = (
          <Dropdown.Item key={idx} href={link}>
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

  //   useEffect(() => {
  //     console.log("awesome:", menuHtml);
  //   }, [menuHtml]);

  return (
    <Container fluid className="bodyContainer">
      <Row className="bodyRow1">
        <Form>
          <Form.Control size="lg" type="search" placeholder="Share a Link..." />
        </Form>
      </Row>
      <Row className="bodyRow2">
        <Container fluid className="sortByContainer">
          <Col className="sortCol1">
            <Button variant="light">Most Popular</Button>
            <Button variant="light">All</Button>
            <Button variant="light">Newest</Button>
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
    </Container>
  );
};

export default Body;
