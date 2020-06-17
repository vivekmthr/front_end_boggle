import React, { useState } from "react";
import "./landing.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
//import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { withRouter } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Grid from "@material-ui/core/Grid";
import Modal from "react-bootstrap/Modal";

//this component will set up the landing page

const Landing = (props) => {
  //variables in landing
  let name = "";
  // const [name, setName] = useState("");
  let code = "";
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  // const SERVER_PORT = "https://backend-boggle.herokuapp.com";
  const SERVER_PORT = `http://localhost:9000`;

  function RenderJoin(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join game
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e) => {
                  console.log(name);
                  name = e.target.value;
                }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Game Code</Form.Label>
              <Form.Control
                onChange={(e) => {
                  console.log(code);
                  code = e.target.value;
                }}
              />
            </Form.Group>
            <Button variant="success" onClick={onClickjoin}>
              Join Game
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function RenderCreate(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Game
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e) => {
                  name = e.target.value;
                }}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Button onClick={onClick}>Create Game</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const createGame = async () => {
    if (name !== "") {
      const new_code = await axios.get(`${SERVER_PORT}/rooms/new`);
      console.log(new_code);
      if (new_code !== "") {
        props.history.push(`/lobby?name=${name}&room=${new_code.data}`);
      }
    }
  };

  const joinGame = () => {
    if (code !== "") {
      props.history.push(`/lobby?name=${name}&room=${code}`);
    }
  };

  const onClickjoin = (e) => {
    joinGame();
    e.preventDefault();
  };

  const onClick = (e) => {
    createGame();
    if (code === "") {
      e.preventDefault();
    }
  };

  return (
    <Grid
      className="body"
      container
      justify="center"
      alignItems="center"
      spacing={1}
    >
      <Container>
        <Row>
          <Col sm={{ offset: 2, span: 3 }} xs={{ offset: 0, span: 3 }}>
            {" "}
            <Button onClick={() => setModalShow1(true)} className="myButton">
              CreateGame
            </Button>
          </Col>
        </Row>

        <Row>
          <Col sm={{ offset: 5, span: 3 }} xs={{ offset: 3, span: 1 }}>
            {" "}
            <h1 classname="header">Online Boggle!!</h1>
          </Col>
        </Row>

        <Row>
          <Col sm={{ offset: 8, span: 3 }} xs={{ offset: 8, span: 2 }}>
            {" "}
            <Button onClick={() => setModalShow(true)} className="myButton">
              Join Game
            </Button>
          </Col>
        </Row>
      </Container>

      <RenderJoin show={modalShow} onHide={() => setModalShow(false)} />
      <RenderCreate show={modalShow1} onHide={() => setModalShow1(false)} />
    </Grid>
  );
};

export default withRouter(Landing);
