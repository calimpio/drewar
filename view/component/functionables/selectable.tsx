import { Card, CircularProgress, Grid, IconButton, Select } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import React, { ChangeEvent, ReactNode } from "react";

export interface ISelectable<T> {
    isTyping: boolean,
    models: T[]
    selected: any
    onSelectedModel: (event: ChangeEvent<{ name?: string; value: unknown; }>, child: ReactNode) => void
    onMouseLeave: ()=>void
    fieldName: string
}

export function selectable<T>(component: ISelectable<T>) {
    return <React.Fragment>
        {
            component.isTyping ? <Grid container item justifyContent="center" ><CircularProgress /></Grid> :
                !component.selected && component.models.length ?
                    <Card style={{ position: "fixed", boxSizing: "content-box", zIndex: 1 }} onClick={component.onMouseLeave}>
                        <Select native multiple onChange={component.onSelectedModel} >
                            {component.models.map((item, key) => <option value={key} key={key} >{item[component.fieldName]}</option>)}
                        </Select>
                        <Grid container item xs={12} justifyContent="center">
                            <IconButton style={{}} >
                                <Cancel style={{ fontSize: "0.7em" }} />
                            </IconButton>
                        </Grid>
                    </Card>
                    : null
        }
    </React.Fragment>
}