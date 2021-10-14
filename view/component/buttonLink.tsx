import React, { Children } from "react";
import { Button, ButtonProps, Link, Typography, TypographyProps, LinkProps, IconButton } from '@material-ui/core'
import { Redirect } from 'react-router-dom'

export interface LinkLogicProps {
    to: string,
    wait?: boolean
    onMouseOver?: (event) => void
    onMouseLeave?: (event) => void
    onClick?: (event) => void
}

export class LinkLogic<T extends React.Component<LinkLogicProps>> {
    private _el: T;
    private _props: LinkLogicProps;
    private _over: boolean;
    public redirect!: React.ReactElement

    public get cursor() {
        return this._over ? "pointer" : "auto"
    }

    constructor(el: T) {
        this._el = el;
        this._props = el.props;
    }

    public go() {
        this.redirect = <Redirect to={this._props.to} />
        this._el.forceUpdate(() => {
            this.redirect = null
            this._el.forceUpdate();
        });
    }

    public onClick = (event) => {
        if (!(this._props.wait)) {
            this.redirect = <Redirect to={this._props.to} />
            this._el.forceUpdate();
            setTimeout(()=>{
                 this.redirect = null
                this._el.forceUpdate();
            })
        }
        if (this._props.onClick) this._props.onClick(event);
    }

    public getPropsWhitExecptions(...except: string[]) {
        let props = {};
        Object.keys(this._props).forEach((key) => {
            if (key !== 'onClick' && key !== 'to' && key !== 'wait' && !(except.filter(value => value == key ? 1 : -1).length))
                props[key] = this._props[key];
        })
        return props;
    }

    public onMouseOver = (event) => {
        this._props.onMouseOver ? this._props.onMouseOver(event) : null;
        this._over = true;
        this._el.forceUpdate();
    }

    public onMouseLeave = (event) => {
        this._props.onMouseLeave ? this._props.onMouseLeave(event) : null;
        this._over = false;
        this._el.forceUpdate();
    }
}

export class ButtonLink extends React.Component<LinkLogicProps & ButtonProps> {
    protected link = new LinkLogic(this);

    public go() {
        this.link.go();
    }

    render() {
        const props = this.link.getPropsWhitExecptions();
        return <React.Fragment>
            <Button type={this.props.type} onClick={this.link.onClick} color={this.props.color} {...props}>
                {this.props.children}
            </Button>
            {this.link.redirect}
        </React.Fragment>
    }
}

export class IconButtonLink extends ButtonLink {
    render() {
        const props = this.link.getPropsWhitExecptions();
        return <IconButton type={this.props.type} onClick={this.link.onClick} color={this.props.color} {...props}>
            {this.props.children}
            {this.link.redirect}
        </IconButton>
    }
}

export class LinkLink extends React.Component<LinkProps & LinkLogicProps> {
    protected link = new LinkLogic(this);

    public go() {
        this.link.go();
    }

    render() {
        let props = this.link.getPropsWhitExecptions('onMouseOver', 'onMouseLeave')
        return <Link onClick={this.link.onClick} style={{ cursor: this.link.cursor }} onMouseOver={this.link.onMouseOver} onMouseLeave={this.link.onMouseLeave} {...props}>
            {this.props.children}
            {this.link.redirect}
        </Link>
    }
}

export class TextLink extends React.Component<TypographyProps & LinkLogicProps> {
    protected link = new LinkLogic(this);

    public go() {
        this.link.go();
    }

    render() {
        let props = this.link.getPropsWhitExecptions('onMouseOver', 'onMouseLeave')
        return <Typography variant={this.props.variant} onClick={this.link.onClick} style={{ cursor: this.link.cursor }} onMouseOver={this.link.onMouseOver} onMouseLeave={this.link.onMouseLeave} {...props}>
            {this.props.children}
            {this.link.redirect}
        </Typography>
    }
}