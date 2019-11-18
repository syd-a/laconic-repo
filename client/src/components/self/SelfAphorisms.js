import React, {Component} from 'react';
import AphorismList from '../display/AphorismList';
import axios from 'axios';

class SelfAphorisms extends Component {
  selfPageStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      fontSize: "1.5rem",
      justifyContent: "center",
      padding: "2rem"
    }
  }

  selfPageTitleStyle = () => {
    return {
      fontSize: "3rem",
      paddingBottom: "2rem"
    }
  }

  getList() {
    return (
      <AphorismList postURL="/api/aphorisms/new" path="/api/speakers/self" />
    )
  }

  requireLogin() {
    return (
      <div>
        Log in to view your aphorisms.
      </div>
    )
  }

  render() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    return (
      <div style={this.selfPageStyle()}>
        <h1 style={this.selfPageTitleStyle()}> My Aphorisms </h1>
        {
          hasAuth ?
          this.getList() :
          this.requireLogin()
        }
      </div>
    );
  }
}

export default SelfAphorisms;
