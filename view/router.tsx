
import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Link, Route, Redirect } from "react-router-dom"
import { Config } from '../view/config';
import loadable from '@loadable/component'
import { AppBar, Grid, Hidden, IconButton, Toolbar, Typography, Menu, Button, LinearProgress } from '@material-ui/core';
import { ButtonLink, TextLink } from './component/buttonLink';
import { Menu as MenuIcon } from '@material-ui/icons';

const LoginView = loadable(() => import('./page/login/login.view'))
const DashboardView = loadable(() => import("./page/dashboard/dashboard.view"))
const Routes = Config.Routes;

interface AppState {
    menuRightEl: HTMLElement
}

class AppRouter extends Component<{}, AppState> {
    state: AppState = {
        menuRightEl: null,
    }

    private onRightMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({ menuRightEl: event.target as HTMLElement })
    }

    private onRightMenuClose = () => {
        this.setState({ menuRightEl: null })
    }

    static app: AppRouter;
    constructor(props: any) {
        super(props)
        AppRouter.app = this;
    }

    private loggoutMenu(next: number, onMenuClose: () => void) {
        return [
            <Switch key={next}>
                <Route exact path={Routes.Login}>
                    <ButtonLink color="inherit" to={Routes.Register} onClick={onMenuClose}>
                        Registrarse
                    </ButtonLink>
                </Route>
                <Route exact path={Routes.Register}>
                    <ButtonLink color="inherit" to={Routes.Login} onClick={onMenuClose}>
                        Iniciar Sesión
                    </ButtonLink>
                </Route>
                <Route path="*">
                    <ButtonLink color="inherit" to={Routes.Login} onClick={onMenuClose}>
                        Iniciar Sesión
                    </ButtonLink>
                    <ButtonLink color="inherit" to={Routes.Register} onClick={onMenuClose}>
                        Registrarse
                    </ButtonLink>
                </Route>
            </Switch>
        ]
    }

    private loggoutNames() {
        return [
            <Route key={0} exact path={Routes.Register}> - Registrarse</Route>,
            <Route key={1} exact path={Routes.Login}> - Iniciar Sesión</Route>,
            <Route key={2} exact path={Routes.ForgetPassword}> - Recuperar Contraseña</Route>
        ]
    }

    render() {
        const isAuth = Config.Auth.isAuth((user) => {
            this.forceUpdate()
        })
        const user = Config.Auth.getUser();
        return <Router>
            {
                !isAuth ?
                    <React.Fragment>
                        <AppBar position="fixed">
                            <Toolbar>
                                <Grid container direction="row" >
                                    <Grid item xs={1}></Grid>
                                    <Grid container item xs={4} alignItems="center">
                                        <TextLink variant="h6" to="/">
                                            {Config.APP_NAME}
                                            {this.loggoutNames()}
                                        </TextLink>
                                    </Grid>
                                    <Grid container item xs={7} justifyContent="flex-end">
                                        <Hidden smUp>
                                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.onRightMenuClick}>
                                                <MenuIcon />
                                            </IconButton>
                                            <Menu anchorEl={this.state.menuRightEl} open={Boolean(this.state.menuRightEl)} onClose={this.onRightMenuClose}>
                                                {this.loggoutMenu(1, this.onRightMenuClose)}
                                            </Menu>
                                        </Hidden>
                                        <Hidden xsDown>
                                            {this.loggoutMenu(2, this.onRightMenuClose)}
                                        </Hidden>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                        <Toolbar />
                    </React.Fragment> : null
            }

            {
                isAuth && !user ? <LinearProgress /> : null
            }
            {
                isAuth ?
                    <Switch>
                        <Route path={Routes.Dashboard} component={DashboardView}></Route>
                        <Route path={Routes.Dashboard + "/*"} component={DashboardView}></Route>
                        <Route path="*"><Redirect to={Routes.Dashboard} /></Route>
                    </Switch>
                    :
                    <Switch>
                        <Route exact path="/">home</Route>
                        <Route path={Routes.Login} component={LoginView} />
                        <Route path={Routes.Register}>register</Route>
                        <Route path="*"><Redirect to="/login" /></Route>
                    </Switch>
            }
        </Router>
    }
}
export default AppRouter