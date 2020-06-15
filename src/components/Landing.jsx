import React, { useState } from 'react';
import "./landing.css"
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios'
//import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { withRouter } from "react-router-dom";




//this component will set up the landing page

const Landing = (props) => {
    //variables in landing
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [showJ, setShowJ] = useState(false)
    const [showC, setShowC] = useState(false)
    const [time, setTime] = useState(60);


    const SERVER_PORT = "https://git.heroku.com/backend-boggle.git"




    const createGame = async () => {
        if (name !== '') {
            const new_code = await axios.get(`${SERVER_PORT}/rooms/new`)
            console.log(new_code)
            if(new_code !== ''){
                props.history.push(`/lobby?name=${name}&Time=${time}&room=${new_code.data}`)
            }
        }
    }

    const onClick = e => {
        createGame();
        if (code === "") {
            e.preventDefault()
        }
    }


    //renders Join form
    const RenderJoin = () => {
        if (showJ === true) {
            return <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={(e) => { setName(e.target.value) }}
                    />
                    
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Game Code</Form.Label>
                    <Form.Control onChange={(e) => { setCode(e.target.value) }} />
                </Form.Group>
                <Link onClick={e => (!name || !code) ? e.preventDefault() : null} to={`/lobby?name=${name}&Time=${time}&room=${code}`}>
                    <button className={'button mt-20'} >Join Game</button>
                </Link>
            </Form>
        }
        else {
            return
        }

    }

    //renders Create form
    const RenderCreate = () => {
        if (showC === true) {
            console.log(showC)
            return <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={(e) => { setName(e.target.value) }}
                    />
                    <Form.Text className="text-muted">
                        
          </Form.Text>
                </Form.Group>
                <Form.Label className="my-1 mr-2" >
    Game Length (seconds)
  </Form.Label>
                <Form.Control as="select" defaultValue="Choose..." 
                  onChange={(e) => { setTime(e.target.value) 
                 }}>
                
                    <option>60</option>
                    <option>120</option>
                    <option>180</option>
                    <option>240</option>
                  </Form.Control>
                <Button onClick={onClick}>Create Game
                </Button>
            </Form>
        }

        else {
            return
        }

    }

    //controls form rendering
    const ShowJoin = () => {
        setShowJ(!showJ)
        console.log(showJ)
    }

    //controls form rendering
    const ShowCreate = () => {
        setShowC(!showC)
        console.log(showC)
    }

    return (
        <div>
            <h1 classname="header">Online Boggle</h1>
            <Button classname="hello" onClick={ShowCreate}>Create game</Button>
            <Button onClick={ShowJoin}>Join Game</Button>
            {RenderJoin()}
            {RenderCreate()}
        </div>
    )

}

export default withRouter(Landing)




