import loadable from "@loadable/component";
import { AppBar, Button, Container, Divider, Drawer, Grid, Hidden, IconButton, LinearProgress, List, Menu, Paper, Toolbar, Typography } from "@material-ui/core";
import { Edit, Gavel, ImportantDevices, Settings, SupervisorAccount, Menu as MenuIcon, Home } from "@material-ui/icons";
import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { TextLink } from "../../component/buttonLink";
import { ListItemExpandable, ListItemLink } from "../../component/listItemExpandable";
import { Config } from "../../config";
import {UserDTO, UserRole } from '../../../src/dto/userDTO';
import DashboardComponent from "./dashboard.component";
const Routes = Config.Routes;



export default class DashboardView extends DashboardComponent {
    private user: UserDTO

    render() {
        this.user = Config.Auth.getUser(() => this.forceUpdate());
        return <React.Fragment>
            {
                this.user ? <React.Fragment>
                    <AppBar position="fixed" style={{ width: "" }}>
                        <Toolbar>
                            <Grid container direction="row" >
                                <Grid item xs={1}>
                                    <IconButton color="inherit" onClick={this.drawerLetfOpen}>
                                        <MenuIcon />
                                    </IconButton>
                                </Grid>
                                <Grid container item xs={4} alignItems="center">
                                    <Typography variant="h6">
                                        {Config.APP_NAME}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={7} justifyContent="flex-end">
                                    <Button onClick={this.logout} color="inherit">Cerrar Sesión</Button>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    <Drawer variant="temporary" open={this.isDrawerLeftOpen} onClose={this.drawerLetfClose}>
                        {this.drawerLeftContent()}
                    </Drawer>

                    <Container>
                        <Toolbar />
                        <Paper>
                            <Switch>
                                <Route exact path={Routes.Dashboard}></Route>
                                {/** pages */}
                                <Route path="*"><Redirect to={Routes.Dashboard} /></Route>
                            </Switch>
                        </Paper>
                    </Container>
                </React.Fragment> :
                    null
            }

        </React.Fragment>
    }

    private drawerLeftContent = () =>
        <React.Fragment>
            <Toolbar>
                <List>
                    <ListItemLink to="" noButtom label={this.user.name} icon={<SupervisorAccount />} />
                </List>
            </Toolbar>
            <Divider />
            <List>
                <ListItemLink label="Dashboard" onClick={this.drawerLetfClose} to="/dashboard" icon={<Home color="primary" />} />
                <Divider />               
            </List>
        </React.Fragment>

}