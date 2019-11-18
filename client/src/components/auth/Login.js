import React, {Component} from 'react';
import axios from 'axios';

class Login extends Component {
  loginPageStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      justifyContent: "center",
      textAlign: "center"
    }
  }

  loginTextStyle = () => {
    return {
      fontSize: "2rem",
      padding: "2rem"
    }
  }

  loginLabelStyle = () => {
    return {
      color: "grey",
      display: "inline-block",
      fontSize: "2rem",
      lineHeight: "1.5rem",
      textAlign: "center",
      width: "95%"
    }
  }

  loginFieldStyle = () => {
    return {
      borderRadius: "20px",
      display: "inline-block",
      fontSize: "2rem",
      lineHeight: "1.5rem",
      margin: "1rem",
      padding: "0.25rem",
      textAlign: "center",
      width: "95%",
    }
  }

  loginButtonStyle = () => {
    return {
      backgroundColor: "black",
      borderColor: "white",
      borderRadius: "20px",
      color: "white",
      fontSize: "2rem",
      padding: "0.25rem",
      textAlign: "center",
      width: "50%",
    }
  }

  logoutButtonStyle = () => {
    return {
      backgroundColor: "black",
      borderColor: "white",
      borderRadius: "10px",
      color: "white",
      fontSize: "3rem",
      marginTop: "2rem",
      padding: "1rem",
      width: "100%"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      hasError: false,
      authChange: false
    };
    this.onNameChange = this.onNameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.requireLogin = this.requireLogin.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
  }

  onNameChange(e) {
    this.setState({name: e.target.value});
  }

  onPasswordChange(e) {
    this.setState({password: e.target.value});
  }

  onLoginSubmit(e) {
    e.preventDefault();
    this.setState({error: false});
    let reqBody = {
      name: this.state.name,
      password: this.state.password
    };
    axios.post("/api/speakers/login", reqBody)
    .then((res) => {
      if(res.data.token) {
        axios.defaults.headers.common["Authorization"] = res.data.token;
        this.setState({
          name: "",
          password: "",
          authChange: !this.state.authChange
        });
      }
    })
    .catch((err) => {
      this.setState({error: true});
    })
  }

  logoutClick(e) {
    e.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    this.setState({authChange: !this.state.authChange});
  }

  requireLogin() {
    return (
      <div>
        <p style={this.loginTextStyle()}>
          {
            this.state.error ?
            "An error occurred with login. Please check your username and password and try again." :
            "Welcome to the login page."
          }
        </p>
        <form onSubmit={this.onLoginSubmit}>
          <label style={this.loginLabelStyle()}>
            Name
            <input
              style={this.loginFieldStyle()}
              type="text"
              value={this.state.name}
              onChange={this.onNameChange}
            />
          </label>
          <label style={this.loginLabelStyle()}>
            Password
            <input
              style={this.loginFieldStyle()}
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </label>
          <input
            style={this.loginButtonStyle()}
            type="submit"
            value="Login"
          />
        </form>
      </div>
    )
  }

  requireLogout() {
    return (
      <p style={this.loginTextStyle()}>
        Welcome to the login page. <br/>
        You are successfully logged in. <br/>
        <button style={this.logoutButtonStyle()} onClick={this.logoutClick}>
          Log Out
        </button>
      </p>
    )
  }

  render() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    return (
      <div style={this.loginPageStyle()}>
        {
          hasAuth ?
          this.requireLogout() :
          this.requireLogin()
        }
      </div>
    );
  }
}

export default Login;
