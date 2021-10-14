import { Component } from "react";
import { ListItemExpandable } from "../../component/listItemExpandable";
import { Config } from "../../config";
interface DashboardState {

}

interface DashboardProps {

}

export default class DashboardComponent extends Component<DashboardProps, DashboardState> {
    state: DashboardState = {

    }
    private _isDrawerLeftOpen = false;

    public get isDrawerLeftOpen() {
        return this._isDrawerLeftOpen
    }

    protected drawerLetfOpen = () => {
        this._isDrawerLeftOpen = true;
        this.forceUpdate();
    }

    protected drawerLetfClose = () => {
        this._isDrawerLeftOpen = false;
        this.forceUpdate();
    }

    protected logout = () => {
        Config.Auth.setUser(null);
    }
}