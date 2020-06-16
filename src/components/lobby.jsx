import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { useTimer } from "use-timer";
import SpacingGrid from "./playerlist.jsx";
import { withRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Prompt
} from "react-router-dom";
import "./lobby.css";




const theme = createMuiTheme();

theme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(5),
    [theme.breakpoints.down("xs")]: {
      height: 20,
      width: 5,
      padding: theme.spacing(4),
      textAlign: "center",
    },
    height: 120,
    width: 100,
    textAlign: "center",
  },
  control: {
    padding: theme.spacing(4),
  },
}));

let scores = [];

const Lobby = (props) => {
  //DECLARATIONS OF STATE NECESSARY THINGS

  const { time, start, pause, reset, isRunning } = useTimer({
    initialTime: 0,
  });

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [currentSocket, setCurrentSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [score_array, setscore_array] = useState([]);
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [showscores, setshowscores] = useState(true);
  const [host, setHost] = useState("");
  const [grid, setGrid] = useState([]);
  const [gridshow, setGShow] = useState(false);
  const [showgrid, setshowgrid] = useState(false);
  const [endgame, setEndgame] = useState(false);
  const [words, setWords] = useState("");
  const [endtime, setendtime]  = useState(10);
  let final_time = 0;
  //const ENDPOINT = `https://backend-boggle.herokuapp.com/rooms`;
  const ENDPOINT = `http://localhost:9000/rooms`;
  const classes = useStyles();
  let [isBlocking, setIsBlocking] = useState(true);
  


  //Use Effect renders
  useEffect(() => {
    let { name, room } = queryString.parse(window.location.search);
    console.log(queryString.parse(window.location.search));
    setName(name);
    setRoom(room);

    const socket = io(`${ENDPOINT}/${room}`);
    setCurrentSocket(socket);

    socket.emit("add_player", name);

    socket.on("add_to_list", (players_list) => {
      console.log(players_list);
      setPlayers(players_list);
    });

    socket.on("host", (host) => {
      console.log("getting called");
      console.log(host);
      setHost(host);
    });

    socket.on("sending_time", (time) => {
      console.log('getting called')
      console.log(time);
      setendtime(time);
      console.log(endtime);
    });

    socket.on("starting_game", (data) => {
      if (data.start) {
        console.log('game is starting')
        console.log(data.start)
        setGrid(data.grid);
        setGShow(data.start);
        setshowgrid(false);
        scores = []
        setWords("")
        setscore_array([])
        reset();
        start();
        setCount(0);
      }
    });

    socket.on("sending scores", (data) => {
      //console.log('I am getting called')
      console.log(data.players);
      if (data.players !== undefined) {
        console.log("data.players not undefined")
        scores = data.players;
        console.log(scores)
        setshowscores(true);
      }
      order_scores(scores);
    });

    window.onpopstate = e => {
      setGShow(false)
      socket.emit("disconnect", name);
      socket.off();
    }

    return () => {
      socket.emit("disconnect", name);
      socket.off();
    };
  }, []);

  useEffect(() => {
    if (time >= endtime && count === 0) {
     console.log('happening')
      setEndgame(true);
      setGShow(false);
      submit_data();
      setCount(1);
    }
  }, [time]);

  //STARTS THE GAME
  const StartGame = (msg) => {
    console.log(name);
    console.log("I am getting called");
    currentSocket.emit("start game", name);
  };
  //Submits data when game is over
  const submit_data = () => {
    currentSocket.emit("Words", {
      name: name,
      words: words,
      no_of_players: players.length,
    });
    currentSocket.emit("get_scores", () => {
      console.log("I am getting called");
    });
  };

  const order_scores = () => {
    for (let i = 0; i < scores.length; i++) {
      score_array.push(total_score1(scores[i].words));
    }
    score_array.sort(function (a, b) {
      setShow(true)
      return b - a;
    });
    setscore_array(score_array)
    console.log(score_array);
  };

  const total_score1 = (pwords) => {
    if (pwords !== undefined) {
      if (pwords.length !== 0) {
        var score = 0;
        pwords.map((word) => {
          score += word.score;
        });
        return score;
      }
    }
  }

  const total_score = (pwords) => {
    if (pwords !== undefined) {
      if (pwords.length !== 0) {
        var score = 0;
        pwords.map((word) => {
          score += word.score;
        });
        return (
          <div>
            {" "}
            <h6> total score : {score}</h6>{" "}
            {score === score_array[0] ? (
              <div>
                <img src="https://img.icons8.com/ios-filled/100/000000/medal2.png" />
              </div>
            ) : (
              ""
            )}
            {score === score_array[1] && score !== score_array[0] ? (
              <img
                src="https://img.icons8.com/ios-filled/100/000000/medal-second-place.png"
                alt=""
              />
            ) : (
              ""
            )}
            {score === score_array[2] && score !== score_array[1] ? (
              <img
                src="https://img.icons8.com/ios-filled/100/000000/medal-third-place.png"
                alt=""
              />
            ) : (
              ""
            )}
          </div>
        );
      }
    }
  };

  const leaderboard = () => {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h3">
          {scores.length > 0 ? (
            <strong>
              <h3>Leaderboard</h3>{" "}
            </strong>
          ) : (
            ""
          )}
        </Typography>
      </ThemeProvider>
    );
  };

  //DISPLAYS SCORES
  const display_scores = () => {
    if (gridshow === false && scores.length > 0) {
      console.log(score_array)
      return (
        <div>
          <Grid container>
            <Grid item xs={12}>
              <br/>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={4}
              >
                {scores.map((player) => (
                  <li>
                    <OverlayTrigger
                    trigger="click"
                    triger= "focus"
                    
                      
                      placement="bottom"
                      overlay={
                        <Popover id="popover-basic">
                          <Popover.Title as="h3">Word List</Popover.Title>
                          <Popover.Content>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              spacing={0}
                            >
                              {player.words.map((word) => (
                                <Grid key={word.word} item>
                                  <h6>
                                    {word.word !== ""
                                      ? `${word.word} - ${word.score}`
                                      : ""}
                                  </h6>
                                </Grid>
                              ))}
                              (tap note to show and hide list)
                            </Grid>
                          </Popover.Content>
                        </Popover>
                      }
                    >
                      <a>
                        <ThemeProvider theme={theme}>
                          <Typography variant="h3">{player.name}</Typography>
                        </ThemeProvider>
                        <h3>{total_score(player.words)}</h3>
                      </a>
                    </OverlayTrigger>
                  </li>
                ))}
                 <Button variant='success' onClick={(e)=>{setshowgrid(!showgrid)}}>See board</Button>
              </Grid>
            </Grid>
           <br/>
          </Grid>
        </div>
      );
    }
  };

  //RENDER FUNCTIONS
  const display_grid = () => {
    //console.log(grid[0])
    if (gridshow === true || showgrid === true) {
      return (
        <div>
          {" "}
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={4}>
                {[0, 1, 2, 3].map((value) => (
                  <Grid key={value} item xs={3}>
                    <Paper className={classes.paper}>
                      {" "}
                      <ThemeProvider theme={theme}>
                        <Typography variant="h3">{grid[value]}</Typography>
                      </ThemeProvider>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={4}>
                {[4, 5, 6, 7].map((value) => (
                  <Grid key={value} item xs={3}>
                    <Paper className={classes.paper}>
                      {" "}
                      <ThemeProvider theme={theme}>
                        <Typography variant="h3">{grid[value]}</Typography>
                      </ThemeProvider>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={4}>
                {[8, 9, 10, 11].map((value) => (
                  <Grid key={value} item xs={3}>
                    <Paper className={classes.paper}>
                      {" "}
                      <ThemeProvider theme={theme}>
                        <Typography variant="h3">{grid[value]}</Typography>
                      </ThemeProvider>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={4}>
                {[12, 13, 14, 15].map((value) => (
                  <Grid key={value} item xs={3}>
                    <Paper className={classes.paper}>
                      {" "}
                      <ThemeProvider theme={theme}>
                        <Typography variant="h3">{grid[value]}</Typography>
                      </ThemeProvider>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
  };
  const render_timer = () => {
    if (gridshow) {
      return (
        <ThemeProvider theme={theme}>
          <Typography variant="h3">
            Find Words!! Seconds Left: {endtime - time}
          </Typography>
        </ThemeProvider>
      );
    } else {
      return;
    }
  };

  const text_area = () => {
    return (
      <Form>
        <Form.Group>
          <div className="text-container">
            <textarea
              className="my_text_area"
              onChange={(e) => {
                setWords(e.target.value);
              }}
              placeholder="enter your words here"
              rows="100"
              cols="20"
            ></textarea>
          </div>
        </Form.Group>
      </Form>
    );
  };

  const show_text = () => {
    if (gridshow === true) {
      return (
        <div>
          <div id="paper">
            <div id="pattern">
              <div id="content">
                {text_area()}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                (Words will automatically submit)
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const render_code = () => {
    if (!gridshow && scores.length === 0) {
      return (
        <div>
          <ThemeProvider theme={theme}>
            <Typography variant="h3">
              <strong>
                {" "}
                {`${host}'s room`} Code: {room}
              </strong>
            </Typography>
          </ThemeProvider>
        </div>
      );
    }
    return (
      <div>
       host:{host} code:{room} {leaderboard()}
      </div>
    );
  };



  return (
    <Container fixed>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={4}>
          <Grid item>{render_code()}</Grid>
        </Grid>
      </Grid>

      <Grid>
        {display_scores()}
        <br />
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Grid
            container
            direction="row-reverse"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item>
              <SpacingGrid
                players={players}
                gridshow={gridshow}
                scores={scores}
              ></SpacingGrid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid
            container
            direction="row-reverse"
            justify="center"
            alignItems="center"
            spacing={0}
          >
            <Grid item>
              {gridshow === false ? (
                <div>
                  <Button
                    onClick={(e) => {
                      StartGame(e);
                    }}
                  >
                    {endgame === true ? "play again" : "start game"}
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={0}
          >
            <Grid item>
              {gridshow === false ? (
                <div>
                  <Form>
                    <Form.Row className="align-items-center">
                      <Col xs="auto" className="my-1">
                        <Form.Label
                          className="mr-sm-2"
                          htmlFor="inlineFormCustomSelect"
                          srOnly
                        >
                          Preference
                        </Form.Label>
                        <Form.Control
                       onChange= {(e) => {
                      final_time = e.target.value
                        console.log(final_time)
    currentSocket.emit('setting_time', (final_time))
                      }}
                          as="select"
                          className="mr-sm-2"
                          id="inlineFormCustomSelect"
                          custom
                        >
                          <option value="120">Set Time...(seconds)</option>
                          <option value="60">60</option>
                          <option value="120">120</option>
                          <option value="180">180</option>
                        </Form.Control>
                      </Col>
                    </Form.Row>
                  </Form>
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            direction="row-reverse"
            justify="center"
            alignItems="center"
            spacing={0}
          >
            <Grid item>{render_timer()}</Grid>
          </Grid>
        </Grid>

        <Grid item sm={8} xs={12}>
          <Grid
            container
            direction="row-reverse"
            justify="space-evenly"
            alignItems="center"
            spacing={0}
          >
            <Grid item>{display_grid()}</Grid>
          </Grid>
        </Grid>

        <Grid item sm={4} xs={12}>
          <Grid
            container
            direction="row-reverse"
            justify="space-evenly"
            alignItems="center"
            spacing={0}
          >
            <Grid item>{show_text()}</Grid>
          </Grid>
        </Grid>
      </Grid>
      <Prompt
        when={isBlocking}
        message={location =>
          `Are you sure you want to leave this page`
        }
      />
    </Container>
  );
};

export default withRouter(Lobby);

/*<div>
<div>
    <h1>Code: {room}</h1>
</div>
<div>
{players.map(function(d, idx){
 return (<li key={idx}>{d.name}</li>)
})}
</div>
{display_grid()}
</div>*/

/*
<div>
            <div><Example /></div>

            <div>
                <h1>Code: {room}</h1>
            </div>

            <div>
                {render_players()}
            </div>

            <div>
                <Button onClick={(e) => {
                    StartGame(e)
                }}>start game</Button>
                {display_grid()}
            </div>

            <div>

            </div>

            <div>
            {render_timer()}
        </div>

        </div>*/

//   <Grid
//   container
//   direction="column"
//   justify="flex-start"
//   alignItems="center"
//   spacing={2}
// >
//   {player.words.map((word) => (
//     <Grid key={word.word} item>
//       <h6>
//         {word.word !== "" ? `${word.word} - ${word.score}` : ""}
//       </h6>
//     </Grid>
//   ))}
//   <h6>{total_score(player.words)}</h6>
// </Grid>
