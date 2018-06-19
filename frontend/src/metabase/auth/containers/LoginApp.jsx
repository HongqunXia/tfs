import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { Link } from "react-router";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc"

import cx from "classnames";
import { t } from 'c-3po';
import AuthScene from "../components/AuthScene.jsx";
import SSOLoginButton from "../components/SSOLoginButton.jsx";
import FormField from "metabase/components/form/FormField.jsx";
import FormLabel from "metabase/components/form/FormLabel.jsx";
import FormMessage from "metabase/components/form/FormMessage.jsx";
import LogoIcon from "metabase/components/LogoIcon.jsx";
import Settings from "metabase/lib/settings";
import Utils from "metabase/lib/utils";
import userManager from "../userManager";

import * as authActions from "../auth";


const mapStateToProps = (state, props) => {
    return {
        loginError:       state.auth && state.auth.loginError,
        user:             state.currentUser
    }
}

const mapDispatchToProps = {
    ...authActions
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginApp extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            credentials: {},
            valid: false,
            showPassword: false
        }
    }

    validateForm() {
        let { credentials } = this.state;

        let valid = true;

        if (!credentials.username || !credentials.password) {
            valid = false;
        }

        if (this.state.valid !== valid) {
            this.setState({ valid });
        }
    }

    componentDidMount() {

        this.validateForm();
    }

    componentDidUpdate() {
        this.validateForm();
    }

    onChangeUserName(fieldName, fieldValue) {
        this.onChange(fieldName, fieldValue.trim())
    }

    onBlurUserName(value) {
        if(!Settings.ssoEnabled()) {
            this.setShowPassword(true);
            return;
        } 

        if(value) {
            if(value.endsWith("@softheon.com")) {
                userManager.signinRedirect();                
            }
            else {
                this.setShowPassword(true);
            }
        }
    }

    setShowPassword(value) {
        this.setState({
            showPassword: value
        });
    }

    onChange(fieldName, fieldValue) {
        this.setState({ credentials: { ...this.state.credentials, [fieldName]: fieldValue }});
    }

    formSubmitted(e) {
        e.preventDefault();

        let { login, location } = this.props;
        let { credentials } = this.state;

        login(credentials, location.query.redirect);
    }

    render() {

        const { loginError } = this.props;

        return (
            
            <div className="full-height full bg-white flex flex-column flex-full md-layout-centered">
                <div className="Login-wrapper wrapper Grid Grid--full md-Grid--1of2 relative z2">
                    <div className="Grid-cell flex layout-centered text-brand">
                        <img src="https://www.softheon.com/HTMLCache/media/Softheon_Logo_Color.png"/>                        
                    </div>
                    <div className="Login-content Grid-cell">
                        <form className="Form-new bg-white bordered rounded shadowed" name="form" onSubmit={(e) => this.formSubmitted(e)} noValidate>
                            <h3 className="Login-header Form-offset">{t`Sign in to Softheon`}</h3>

                            <FormMessage formError={loginError && loginError.data.message ? loginError : null} ></FormMessage>

                            <FormField ref="userNameFormField" key="username" fieldName="username" formError={loginError}>
                                <FormLabel title={Settings.ldapEnabled() ? t`Username or email address` : t`Email address`} fieldName={"username"} formError={loginError} />
                                <input className="Form-input Form-offset full py1" name="username" placeholder="youlooknicetoday@email.com" type="text" onBlur={(e) => this.onBlurUserName(e.target.value)} onChange={(e) => this.onChange("username", e.target.value)} autoFocus />
                                <span className="Form-charm"></span>
                            </FormField>

                            { this.state.showPassword && 
                            <FormField key="password" fieldName="password" formError={loginError}>
                                <FormLabel title={t`Password`}  fieldName={"password"} formError={loginError} />
                                <input className="Form-input Form-offset full py1" name="password" placeholder="Shh..." type="password" onChange={(e) => this.onChange("password", e.target.value)} />
                                <span className="Form-charm"></span>
                            </FormField>
                            }

                            <div className="Form-field">
                                <ul className="Form-offset">
                                    <input name="remember" type="checkbox" defaultChecked /> <label className="inline-block">{t`Remember Me:`}</label>
                                </ul>
                            </div>

                            <div className="Form-actions p2 Grid Grid--full md-Grid--1of2">
                                <button className={cx("Button Grid-cell", {'Button--primary': this.state.valid})} disabled={!this.state.valid}>
                                    Sign in
                                </button>
                                <Link to={"/auth/forgot_password"+(Utils.validEmail(this.state.credentials.username) ? "?email="+this.state.credentials.username : "")} className="Grid-cell py2 sm-py0 text-grey-3 md-text-right text-centered flex-full link" onClick={(e) => { window.OSX ? window.OSX.resetPassword() : null }}>{t`I seem to have forgotten my password`}</Link>
                            </div>
                        </form>
                    </div>
                </div>
                <AuthScene />
            </div>
        );
    }
}
