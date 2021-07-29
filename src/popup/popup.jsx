import React, { useState, useRef } from "react";
import { render } from "react-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import useStyles from "./useStyles.js";

const root = document.getElementById("root");
chrome.storage.sync.get(["email", "name"], (result) => {
  console.log(result)
  const email = result.email || '';
  const name = result.name || '';
  render(<App email={email} name={name} />, root);
});

function App({ email, name }) {
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const emailInput = useRef(2);
  const nameInput = useRef(2);

  const onClick = (e) => {
    e.preventDefault();
    setSent(true);
    const newEmail = emailInput.current.value;
    const newName = nameInput.current.value;
    chrome.storage.sync.set({ email: newEmail, name: newName }, () => {
      if (chrome.runtime.error) console.log("Runtime error.");
      chrome.runtime.sendMessage(
        { email: newEmail, name: newName },
        (response) => {
          console.log(response);
        }
      );
    });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Send data to UIUC Team
          </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              inputRef={nameInput}
              disabled={sent}
              defaultValue={name}
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              inputRef={emailInput}
              disabled={sent}
              defaultValue={email}
              label="Email Address"
              name="email"
              autoComplete="email"
              helperText="Please use the email you used to sign up for the study."
            />
            <Button
              type="submit"
              fullWidth
              disabled={sent}
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onClick}
            >
              Send Data / Compartir Data
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            {/* </Grid> */}
            <Box mt={2} variant="body2">
              You have elected to participate in the UIUC Last Mile Study. By
              clicking the link above, you will share with us the travel
              information necessary to complete the study. For more information{" "}
              <Link href="#" variant="body2">
                Click Here
              </Link>
            </Box>
            <Box mt={2} variant="body2">
              Usted ha elegido participar en el Last Mile Study por University
              of Illinois Urbana-Champaign. Al hacer clic en el enlace de
              arriba, nos comparte su información de viaje que Google Timeline
              ya ha coleccionado. Compartir esta información es necesario para
              recibir mas beneficios, tal como creditos de Uber. Para obtener
              más información, <Link href="#">haga click acqui.</Link> Gracias
              por su participacion.
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
