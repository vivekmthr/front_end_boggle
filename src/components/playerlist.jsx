import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 100,
        width: 400,
    },
    control: {
        padding: theme.spacing(),
    },
}));

export default function SpacingGrid(props) {
    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();

    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };
if(!props.gridshow && props.scores.length === 0){
    return (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Grid container justify="center"
                   >
                       <h6>Players</h6>
                    <Grid item container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center">
                        {props.players.map((player, index) => (
                            <Grid key={index} item>
                                <div>{player.name}</div>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}
return null
}


// const leaderboard = () => {
//     return (
//       <ThemeProvider theme={theme}>
//         <Typography variant="h3">
//           <strong>{scores.length > 0 ? <h3>Leaderboard!!!</h3> : ""}</strong>
//         </Typography>
//       </ThemeProvider>
//     );
//   };