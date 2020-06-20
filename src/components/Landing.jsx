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
  const [modalShow2, setModalShow2] = React.useState(false);


  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          How To Play
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
  <li>1. create a game and share the given code with your friends</li>
  <li>2. once everyone has joined the game the host can set the game length and the minimum word length</li>
  <li>3. once all the players have joined the room start the game</li>
  <li>4. find words if they are connected by adjacent or diagonal letters</li>
  <li>5. When the time is completed, the leaderboard will show who won!</li>
</div> 
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

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
          <Col xs={{ offset: 3, span: 6 }}>
            {" "}
            <Button onClick={() => setModalShow2(true)} className="myButton">
              Instructions
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={{ offset: 3, span: 6 }}>
            {" "}
            <h1 classname="header">Online Boggle!!</h1>
          </Col>
        </Row>

        <Row>
          <Col sm={6} xs={6}>
            {" "}
            <Button onClick={() => setModalShow(true)} className="myButton">
              Join Game
            </Button>
          </Col>
          <Col sm={6} xs={6}>
            {" "}
            <Button onClick={() => setModalShow1(true)} className="myButton">
              Create Game
            </Button>
          </Col>
        </Row>
        
      </Container>

      <RenderJoin show={modalShow} onHide={() => setModalShow(false)} />
      <RenderCreate show={modalShow1} onHide={() => setModalShow1(false)} />
      <MyVerticallyCenteredModal
        show={modalShow2}
        onHide={() => setModalShow2(false)}
      />
    </Grid>
  );
};

export default withRouter(Landing);
