import React, { Component } from 'react'

export default class Timer extends Component {
    state = {
        minutes: 3,
        seconds: 0,
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            } 
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const { minutes, seconds } = this.state
        return (
            <div>
                { minutes === 0 && seconds === 0
                    ? <h1>Busted!</h1>
                    : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                }
            </div>
        )
    }
}




return (

    <Grid item xs={12}>
        <Paper className={classes.control}>
            <Grid container>
                <Grid item>
                    <FormLabel><h4>Players</h4></FormLabel>
                    <RadioGroup
                        name="spacing"
                        aria-label="spacing"
                        value={spacing.toString()}
                        onChange={handleChange}
                        row
                    >
                        {props.players.map((player) => (
                            <FormControlLabel
                               {player.name}
                            />
                        ))}
                    </RadioGroup>
                </Grid>
            </Grid>
        </Paper>
    </Grid>

);
}

{props.players.map((player, index) => (
    <Grid key={index} item>
        {player.name}
    </Grid>
))}