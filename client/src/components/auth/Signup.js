import React, {Component} from 'react';
import axios from 'axios';

class Signup extends Component {
  signupPageStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      justifyContent: "center",
      textAlign: "center"
    }
  }

  signupTextStyle = () => {
    return {
      fontSize: "2rem",
      padding: "2rem"
    }
  }

  signupLabelStyle = () => {
    return {
      color: "grey",
      display: "inline-block",
      fontSize: "2rem",
      lineHeight: "1.5rem",
      textAlign: "center",
      width: "95%"
    }
  }

  signupFieldStyle = () => {
    return {
      borderRadius: "20px",
      display: "inline-block",
      fontSize: "2rem",
      lineHeight: "1.5rem",
      margin: "1rem",
      padding: "0.25rem",
      textAlign: "center",
      width: "95%"
    }
  }

  signupButtonStyle = () => {
    return {
      backgroundColor: "black",
      borderColor: "white",
      borderRadius: "20px",
      color: "white",
      fontSize: "2rem",
      padding: "0.25rem",
      textAlign: "center",
      width: "50%"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      confirmPassword: "",
      errors: [],
      signedUp: false
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
  }

  blankTemplate() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    if(hasAuth) {
      return (
        <p style={this.signupTextStyle()}>
          You are currently logged in.
        </p>
      )
    } else {
      return (
        <p style={this.signupTextStyle()}>
          You are signed up. Log in to proceed.
        </p>
      )
    }
  }

  onNameChange(e) {
    this.setState({name: e.target.value});
  }

  onPasswordChange(e) {
    this.setState({password: e.target.value});
  }

  onConfirmPasswordChange(e) {
    this.setState({confirmPassword: e.target.value});
  }

  onSignupSubmit(e) {
    e.preventDefault();
    this.setState({errors: []});
    let errArr = [];

    if(this.state.password !== this.state.confirmPassword) {
      errArr.push("Password and confirmation do not match.");
      this.setState({errors: errArr});
      return 0;
    }

    let reqBody = {
      name: this.state.name,
      password: this.state.password
    };
    axios.post("/api/speakers/new", reqBody)
    .then((res) => {
      if(res.data) {
        this.setState({
          name: "",
          password: "",
          signedUp: true
        });
      }
    })
    .catch((err) => {
      errArr = err.response.data.errorMessages;
      this.setState({errors: errArr});
    })

  }

  showSignup() {
    return (
      <div>
        <p style={this.signupTextStyle()}>
          {
            (this.state.errors.length > 0) ?
            "The following errors occurred: " + this.state.errors.join(" ") :
            "Welcome to the sign up page."
          }
        </p>
        <form onSubmit={this.onSignupSubmit}>
          <label style={this.signupLabelStyle()}>
            Name
            <input
              style={this.signupFieldStyle()}
              type="text"
              value={this.state.name}
              onChange={this.onNameChange}
            />
          </label>
          <label style={this.signupLabelStyle()}>
            Password
            <input
              style={this.signupFieldStyle()}
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </label>
          <label style={this.signupLabelStyle()}>
            Confirm Password
            <input
              style={this.signupFieldStyle()}
              type="password"
              value={this.state.confirmPassword}
              onChange={this.onConfirmPasswordChange}
            />
          </label>
          <input
            style={this.signupButtonStyle()}
            type="submit"
            value="Sign Up"
          />
        </form>
      </div>
    )
  }

  render() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    return (
      <div style={this.signupPageStyle()}>
        {
          (hasAuth || this.state.signedUp) ?
          this.blankTemplate() :
          this.showSignup()
        }
      </div>
    )
  }
}

export default Signup;
