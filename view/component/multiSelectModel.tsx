import React from "react";
import { Grid } from "@material-ui/core";
import { SelectModelValidator } from "./selectModel";
import { AxiosInstance, AxiosResponse } from "axios";
import ChipInput from "material-ui-chip-input";
import IPage from "../model/page";
import { ISelectable, selectable } from "./functionables/selectable";

export interface MultiSelectModelProps<T> {
    api: AxiosInstance
    url: string
    fieldName: string
    label: string
    items?: T[]
    unique?: boolean
    onChange: (items: T[]) => void
}

export class MultiSelectModel<T> extends React.Component<MultiSelectModelProps<T>> implements ISelectable<T> {
    public isTyping: boolean = false;
    public selected: any;
    public fieldName: string = this.props.fieldName;
    public models: T[] = [];
    private items: T[] = [];

    onSelectedModel = (event: React.ChangeEvent<{ name?: string; value: unknown; }>, child: React.ReactNode) => {
        const item = this.models[Number(event.target.value)];
        const has = this.items.filter((i) => i[this.fieldName] === item[this.fieldName]);
        if (!has.length && this.props.unique) {
            this.items.push(item);
            this.props.onChange(this.items);
            this.selected = true;
            this.forceUpdate();
        }
    };

    onMouseLeave: () => {

    };

    private onAddChip = async (chip) => {
        try {
            this.isTyping = true;
            this.forceUpdate();
            const resp = await this.props.api.get<T, AxiosResponse<IPage<T>>>(`${this.props.url}?filter=${encodeURIComponent(`${this.props.fieldName}#${chip}`)}`);
            if (resp.data && resp.data.count == 1) {
                const item = resp.data.items[0];
                const has = this.items.filter((i) => i[this.fieldName] === item[this.fieldName]);
                if (!has.length && this.props.unique) {
                    this.items.push(item);
                    this.props.onChange(this.items);
                    this.selected = true;
                }
            } else if (resp.data) {
                this.selected = false;
                this.models = resp.data.items;
            }
            this.isTyping = false;
            this.forceUpdate();
        } catch (err) {

        }
    }

    onChange = (chips: any[]) => {

    };

    onDeleteChip = (chip: any, index: number) => {
        this.items.splice(index, 1);
        this.props.onChange(this.items);
        this.forceUpdate();
    };

    render() {
        const { api, url, fieldName, label } = this.props;
        this.items = this.props.items || this.items;
        return <>
            <Grid item xs={12}>
                <ChipInput
                    label={this.props.label}
                    style={{ width: "100%" }}
                    value={this.items.map((item) => item[fieldName])}
                    onAdd={this.onAddChip}
                    onDelete={this.onDeleteChip}
                    onChange={this.onChange}
                />
            </Grid>
            <Grid container>

                {selectable(this)}
            </Grid>
        </>
    }
}