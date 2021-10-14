import { Card, CircularProgress, Grid, IconButton, NativeSelect, Paper, Select, TextField } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { AxiosInstance } from "axios";
import React, { ChangeEvent, ReactNode } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import IPage from "../model/page";
import { ISelectable, selectable } from "./functionables/selectable";

export interface SelectModelProps<T> {
    api: AxiosInstance,
    value?: string,
    url: string,
    label: string,
    fieldName: string,
    validators?: string[],
    errorMessages?: string[],
    required?: boolean
    requiredMessage?: string
    uniqueMessage?: string
    selected?: T
    unique?: boolean
    onChangeModel?: (model: T) => void
    onChange?: (value: any) => void
}

export class SelectModelValidator<T> extends React.Component<SelectModelProps<T>> implements ISelectable<T> {

    public isTyping = false;
    public models: T[] = [];
    public selected: T = this.props.selected;
    public fieldName = this.props.fieldName;

    private static renders = 0;
    private value = "";
    private api = this.props.api;   
    private url = this.props.url;    
    private required = `${this.props.label}.${this.fieldName}.required`
    private unique = `${this.props.label}.${this.fieldName}.unique`
    private isLeaving = false;

    protected onFocusFindModel = (event) => {
        this.isLeaving = false;
        this.onFindModel(event);
    }

    protected onBlur = () => {
        this.isLeaving = true;
        this.forceUpdate();
    }

    public onMouseLeave = () => {
        if (this.isLeaving) {
            this.models = [];
            this.forceUpdate();
        }
    }

    componentDidMount() {
        SelectModelValidator.renders++;
        this.required += "."+SelectModelValidator.renders;
        this.unique += "."+SelectModelValidator.renders;

        console.log(SelectModelValidator.renders);
        

        ValidatorForm.addValidationRule(this.required, (value: any) => {
            return (!!this.selected && !this.props.unique) || (this.props.unique && !!this.value);
        })

        ValidatorForm.addValidationRule(this.unique, (value: any) => {
            return (!this.selected);
        })
    }

    protected onFindModel = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.isTyping = true;
        const value = this.value = event.target.value;
        this.selected && this.selected[this.fieldName] != value ? this.selected = null : null;
        if (this.selected) this.isTyping = false;
        setTimeout(() => {
            if (this.value == value && (!(this.selected && this.selected[this.fieldName] == value) || (this.props.unique))) {
                var filter = `${this.fieldName}${this.props.unique ? "=" : "#"}${value}`;
                this.api.get(`${this.url}?filter=${encodeURIComponent(filter)}&limit=10`).then((res => {
                    console.log("wow");
                    this.isTyping = false;
                    var page = res.data as IPage<T>;
                    this.models = page.items;
                    if (page.count == 1) {
                        this.selected = this.models[0];
                        this.value = this.selected[this.fieldName]
                    }
                    this.forceUpdate();
                })).catch((err) => {

                })
            }

        }, 500)
        this.props.onChange ? this.props.onChange(value) : null;
        this.forceUpdate();
    }

    public onSelectedModel = (event: ChangeEvent<{ name?: string; value: unknown; }>, child: ReactNode) => {
        const index = Number(event.target.value);
        this.selected = this.models[index]
        if (!this.props.unique) this.value = this.selected[this.fieldName];
        this.props?.onChangeModel(this.selected)
        this.forceUpdate();
    }



    render() {
        const { validators, errorMessages, label, required, requiredMessage, unique, uniqueMessage, value } = this.props;
        const vldtrs = validators ? validators : [];
        const msgvldtrs = errorMessages ? errorMessages : [];
        required ? (() => { vldtrs.push(this.required); msgvldtrs.push(requiredMessage) })() : null
        unique ? (() => { vldtrs.push(this.unique); msgvldtrs.push(uniqueMessage) })() : null
        return (
            <React.Fragment>
                <TextValidator
                    type="text"
                    style={{ width: "100%" }}
                    label={label} name={""}
                    value={value ?? this.selected?.[this.fieldName] ?? this.value}
                    validators={vldtrs}
                    errorMessages={msgvldtrs}
                    onChange={this.onFindModel}
                    onFocus={this.onFocusFindModel}
                    onBlur={this.onBlur}
                    onMouseLeave={this.onMouseLeave}
                />

                {
                    selectable(this)
                }
            </React.Fragment>
        )
    }
}