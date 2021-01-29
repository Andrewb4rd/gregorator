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

const Header = () => {
  const [radioValue, setRadioValue] = useState("1");
  const [radioValueName, setRadioValueName] = useState("");
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

  return (
    <Container fluid id="header">
      <Row>
        <Col className="headerColumn1">
          <div className="logoShort">GREG</div>
          <div className="logo">GREGORATOR</div>
        </Col>
        <Col>
          <Form>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder={"Search by " + radioValueName}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary">Search</Button>
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
