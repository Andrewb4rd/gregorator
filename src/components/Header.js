import React, { useEffect, useState } from "react";
import "../styles/Header.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { getLinksByTag, getAllLinks } from "../api/index";

const Header = ({ setLinks }) => {
  const [radioValue, setRadioValue] = useState("1");
  const [radioValueName, setRadioValueName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const radios = [
    { name: "URL", value: "1" },
    { name: "TAGS", value: "2" },
  ];

  useEffect(() => {
    if (radioValue === "1") {
      setRadioValueName(radios[0].name);
    } else if (radioValue === "2") {
      setRadioValueName(radios[1].name);
    }
  }, [radioValue]);

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let radio = radioValue;
    let search = searchValue;
    // SEARCH BY URL
    if (radio === "1") {
      let result = await getAllLinks();
      let linkArr = result;
      let filteredLinks = linkArr.filter((link) => {
        if (link.url.includes(search)) {
          return link.url;
        }
      });
      if (!filteredLinks.length) {
        alert(`Sorry, there were no URL results for "${search}".`);
      } else {
        setLinks(filteredLinks);
      }
      // SEARCH BY TAGS
    } else {
      let result = await getLinksByTag(search);
      let linkArr = result.links;
      if (!linkArr.length) {
        alert(`Sorry, there were no tag results for "${search}".`);
      } else {
        setLinks(linkArr);
      }
    }
  };

  return (
    <Container fluid id="header">
      <Row>
        <Col className="headerColumn1">
          <div className="logoShort">GREG</div>
          <div className="logo">GREGORATOR</div>
        </Col>
        <Col>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Control
                type="search"
                onChange={onSearchChange}
                placeholder={"Search by " + radioValueName}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" type="submit">
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <div className="searchFormButtonGroup">
              <ButtonGroup toggle>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
          </Form>
        </Col>
        <Col />
      </Row>
    </Container>
  );
};

export default Header;
