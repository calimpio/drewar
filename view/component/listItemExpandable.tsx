import { Collapse, ListItem, ListItemIcon, ListItemProps, ListItemText, CollapseProps, List, Divider, ListItemIconProps } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";
import { Redirect } from "react-router";
import { LinkLogic, LinkLogicProps } from "./buttonLink";

export interface ListItemExpandableProps {
    startOpen?: boolean
    label: string
    icon?: JSX.Element;
    unmountOnExit?: boolean;
    timeout?: CollapseProps["timeout"]
    content: JSX.Element[]
}

export class ListItemExpandable extends React.Component<ListItemExpandableProps> {
    private _open = this.props.startOpen || false;

    setOpen() {
        this._open = !this._open;
        this.forceUpdate();
    }

    isOpen() {
        return this._open;
    }

    render() {
        return <React.Fragment>
            <ListItem button onClick={() => this.setOpen()}>
                {
                    this.props.icon ?
                        <ListItemIcon>
                            {this.props.icon}
                        </ListItemIcon> : null
                }
                <ListItemText primary={this.props.label} />
                {this.isOpen() ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.isOpen()} timeout={this.props.timeout} unmountOnExit={this.props.unmountOnExit}>
                {this.props.content}
            </Collapse>
            <Divider />
        </React.Fragment>
    }
}


export interface SimpleListItemProps extends LinkLogicProps, Omit<LinkLogicProps, "to"> {
    label: string
    icon?: JSX.Element;
    onClick?: React.MouseEventHandler<HTMLDivElement>    
    noButtom?: ListItemProps["button"]
    iconColor?: ListItemIconProps["color"]
    wait?: boolean
}


export class ListItemLink extends React.Component<SimpleListItemProps> {
    private link = new LinkLogic(this)

    render() {        
        return <React.Fragment>
            {
                this.props.noButtom ?
                    <ListItem>
                        {
                            this.props.icon ?
                                <ListItemIcon color={this.props.iconColor}>
                                    {this.props.icon}
                                </ListItemIcon> : null
                        }
                        <ListItemText primary={this.props.label} />
                    </ListItem> : <ListItem button onClick={this.link.onClick} >
                        {
                            this.props.icon ?
                                <ListItemIcon color={this.props.iconColor}>
                                    {this.props.icon}
                                </ListItemIcon> : null
                        }
                        <ListItemText primary={this.props.label} />
                    </ListItem>
            }
            {this.link.redirect}
        </React.Fragment>
    }
}