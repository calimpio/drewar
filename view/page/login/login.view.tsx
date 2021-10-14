import React from "react";
import LoginComponent from "./login.component";
import { Button, Typography, Grid, Container, Paper, Checkbox, FormControlLabel, InputAdornment } from '@material-ui/core'
import { LinkLink } from "../../component/buttonLink";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Route, Switch } from "react-router-dom";
import { Person, Lock, Save } from "@material-ui/icons";
import { Config } from "../../config";
const Routes = Config.Routes;
export default class LoginView extends LoginComponent {
    render() {
        return (
            <React.Fragment>
                <Container>
                    <Paper>
                        <Switch>
                            <Route exact path="/login">
                                <ValidatorForm onSubmit={this.onLogin} onError={this.onError} ref={(ref) => this.form = ref}>
                                    <Container>
                                        <Grid container justifyContent="center">
                                            <Grid container item md={8} justifyContent="center">
                                                <Grid container item xs={12} justifyContent="center" >
                                                    <Typography variant="h2" color="primary">Iniciar Sesión</Typography>
                                                </Grid>
                                                {
                                                    this.state.badCredentialsError ?
                                                        <Grid container item xs={12} justifyContent="center" >
                                                            <Typography variant="caption" style={{ color: "red" }}>El usuario o la constraseña no coinsiden.</Typography>
                                                        </Grid>
                                                        : null
                                                }
                                                <Grid item xs={12}>
                                                    <TextValidator InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person color={!this.user.username && !this.usernameEl ? "primary" : this.user.username ? "primary" : "error"} />
                                                            </InputAdornment>
                                                        ),
                                                    }} value={this.user.username} type="text" name="username" label="Usuario" style={{ width: "100%" }} onChange={this.setUsername} validators={['Required', 'BadCredentials']} errorMessages={["Campo Requerido", null]} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextValidator InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Lock color={!this.user.password && !this.passwordEl ? "primary" : this.user.password ? "primary" : "error"} />
                                                            </InputAdornment>
                                                        ),
                                                    }} value={this.user.password} name="password" label="Contraseña" style={{ width: "100%" }} onChange={this.setPassword} type="password" validators={['Required', 'BadCredentials']} errorMessages={["Campo Requerido", null]} />
                                                </Grid>
                                                <Grid item xs={12} container justifyContent="center" alignItems="center">
                                                    <FormControlLabel 
                                                        control={<Checkbox icon={<Save/>} color="primary" onChange={this.setSaveSession} /> }
                                                        label="Guardar sesión."
                                                    />                                                    
                                                </Grid>
                                                <Grid container item xs={12} justifyContent="center">
                                                    <Button type="submit" disabled={!this.state.valid} color={this.state.valid ? "primary" : "default"} >Iniciar Sesion</Button>
                                                </Grid>
                                                <Grid container item xs={12} justifyContent="center" style={{}}>
                                                    <LinkLink to={Routes.ForgetPassword}>¿Olvidó la contraseña?</LinkLink>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </ValidatorForm>
                            </Route>
                            <Route path={Routes.ForgetPassword}> todo </Route>
                        </Switch>
                    </Paper>
                </Container>
            </React.Fragment>
        )
    }
}