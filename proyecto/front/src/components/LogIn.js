import React, { Component } from 'react';
import M from "materialize-css";
import { FormattedMessage } from 'react-intl';

class LogIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_login: '',
            user_password: ''
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(e) {
        const { value, id } = e.target;
        this.setState({
            [id]: value
        });
    }

    handleSubmit() {
        var identified = false;
        var idIdentified = 0;
        fetch('/api/user').then(res => res.json()).then(data => {
            data.forEach((dat) => {
                if ((dat.user_email === this.state.user_login || dat.user_login === this.state.user_login) && dat.user_password === this.state.user_password) {
                    idIdentified = dat.id;
                    identified = true;
                }
            });

            if (identified == true) {
                M.toast({ html: 'Sesión iniciada', classes: 'rounded' });
                this.props.enableLogIn({ idIdentified });
            }
            else if (this.state.user_password == '' || this.state.user_login == '') {
                M.toast({ html: 'Ingresa valores válidos para iniciar sesión', classes: 'rounded' });
            }
            else {
                M.toast({ html: 'Correo electrónico/Login sin registrar o contraseña incorrecta', classes: 'rounded' });
            }
        });
        if (!identified) {
            fetch('/api/contractor').then(res => res.json()).then(data => {
                data.forEach((dat) => {
                    if ((dat.contractor_email == this.state.user_login || dat.contractor_login == this.state.user_login) && dat.contractor_password == this.state.user_password) {
                        idIdentified = dat.id;
                        identified = true;
                    }
                });

                if (identified == true) {
                    M.toast({ html: 'Sesión iniciada', classes: 'rounded' });
                    this.props.enableLogIn({ idIdentified });
                }
                else if (this.state.user_password == '' || this.state.user_login == '') {
                    M.toast({ html: 'Ingresa valores válidos para iniciar sesión', classes: 'rounded' });
                }
                else {
                    M.toast({ html: 'Correo electrónico/Login sin registrar o contraseña incorrecta', classes: 'rounded' });
                }
            });
        }
    }

    componentDidMount() {
        document.dispatchEvent(new Event('component'));
    }

    render() {
        return (
            <div className="container">

                <br></br>
                <div className="row">

                    <form className="col s12">
                        <div className="container">
                            <center>
                                <h5>
                                    <FormattedMessage
                                        id="SignIn.FormTitle"
                                        defaultMessage="Sign In"
                                    />
                                </h5>
                            </center>
                            <br></br>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="user_login" type="email" className="validate" onChange={this.handleInput} />
                                    <label htmlFor="user_login">
                                        <FormattedMessage
                                            id="SignIn.UserLoginLabel"
                                            defaultMessage="Login or Email"
                                        />
                                    </label>
                                    <span className="helper-text" data-error="No es válido" data-success="Es válido">
                                        <FormattedMessage
                                            id="SignIn.UserLoginHint"
                                            defaultMessage="Enter your email or login ..."
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="user_password" type="password" className="validate" onChange={this.handleInput} />
                                    <label htmlFor="user_password">
                                        <FormattedMessage
                                            id="SignIn.PasswordLabel"
                                            defaultMessage="Password"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>

                    <br></br>

                    <center><a onClick={this.handleSubmit} className="waves-effect waves-light btn red darken-3">
                        <FormattedMessage
                            id="SignIn.SignInButton"
                            defaultMessage="Sign In"
                        />
                    </a></center>
                    <br></br>
                    <center>
                        <h6>
                            <FormattedMessage
                                id="SignIn.RegisterLabel"
                                defaultMessage="If you do not have a registered account, you can create it "
                            />
                            <a href="#" onClick={this.props.toSignUp}>
                                <FormattedMessage
                                    id="SignIn.RegisterEndLabel"
                                    defaultMessage="here."
                                />
                            </a>
                            </h6>
                    </center>
                </div>
            </div>

        )
    }
}

export default LogIn;