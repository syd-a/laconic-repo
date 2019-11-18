import React, {Component} from 'react';
import axios from 'axios';
import AphorismList from '../display/AphorismList';
import Follow from '../display/Follow';

class Feed extends Component {
  feedPageStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      fontSize: "1.5rem",
      justifyContent: "center",
      padding: "2rem",
    }
  }

  feedPageTitleStyle = () => {
    return {
      fontSize: "3rem",
      paddingBottom: "2rem"
    }
  }

  requireLogin() {
    return (
      <div>
        Log in to view your feed.
      </div>
    )
  }

  getFeed() {
    return (
      <div style={this.feedPageStyle()}>
        <AphorismList path="/api/speakers/feed" />
        <Follow />
      </div>
    )
  }

  render() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    return (
      <div style={this.feedPageStyle()}>
        <h1 style={this.feedPageTitleStyle()}> Feed </h1>
        {
          hasAuth ?
          this.getFeed() :
          this.requireLogin()
        }
      </div>
    );
  }
}

export default Feed;
