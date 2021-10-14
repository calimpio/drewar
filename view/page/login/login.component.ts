import { Component, ChangeEvent, FormEvent } from "react";
import {IUserLoginBody, UserDTO, UserRole } from '../../../src/dto/userDTO';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { UserService } from "../../service/userService";

interface LoginState {
    valid: boolean,
    badCredentialsError: boolean
}

export default class LoginComponent extends Component<{}, LoginState> {
    state: LoginState = {
        valid: false,
        badCredentialsError: false,
    }

    protected form!: ValidatorForm    
    protected passwordEl: HTMLElement;
    protected usernameEl: HTMLElement;

    protected user: IUserLoginBody = {
        username: "",
        password: ""
    }

    private _saveSession = false;

    protected setSaveSession = (event: ChangeEvent<HTMLInputElement>) =>{
        this._saveSession =  event.target.checked;
        this.forceUpdate();
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('Required', (value: string) => {
            return value.length > 0;
        })

        ValidatorForm.addValidationRule('BadCredentials', (value: string) => {
            return !this.state.badCredentialsError;
        })
    }

    protected isFormValid() {
        if(this.state.badCredentialsError){
            this.state.badCredentialsError = false;
            this.form.resetValidations();
        }
        this.state.valid = this.user.password.length > 0 && this.user.username.length > 0;
    }

    protected setUsername = (event: ChangeEvent<HTMLInputElement>) => {
        this.user.username = event.target.value;
        this.usernameEl = event.target;
        this.isFormValid();
        this.forceUpdate();
    }

    protected setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        this.user.password = event.target.value; 
        this.passwordEl = event.target;      
        this.isFormValid();
        this.forceUpdate();
    }

    protected onLogin = (event: FormEvent<Element>) => {
        UserService.sign(this.user, this._saveSession).then().catch(data => {            
            if (data.status == 400) {
                this.setState({ badCredentialsError: true, valid: false },()=>{
                    this.form.isFormValid(false).then()  
                }) 
            }
        })
    }

    protected onError = (errors: any[]) => {
        
    };
}