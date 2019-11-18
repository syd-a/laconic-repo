import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {
  headerStyle = () => {
    return {
      background: "white",
      color: "black",
      fontSize: "1.5rem",
      padding: "1.5rem",
      paddingTop: "2rem",
      textAlign: "center"
    }
  }

  headerTitleStyle = () => {
    return {
      fontSize: "5rem",
      letterSpacing: "1rem"
    }
  }

  headerPStyle = () => {
    return {
      color: "grey"
    }
  }

  headerListStyle = () => {
    return {
      display: "flex",
      justifyContent: "space-between",
      listStyleType: "none",
      paddingTop: "2rem"
    }
  }

  headerLinkStyle = () => {
    return {
      color: "black"
    }
  }

  render() {
    return (
      <div style={this.headerStyle()}>
        <h1 style={this.headerTitleStyle()}>LACONIC</h1>
        <p style={this.headerPStyle()}>A MERN Microblogging Site</p>
        <ul style={this.headerListStyle()}>
          <li><Link style={this.headerLinkStyle()} to="/">Home</Link></li>
          <li><Link style={this.headerLinkStyle()} to="/index">Speakers Index</Link></li>
          <li><Link style={this.headerLinkStyle()} to="/self">My Aphorisms</Link></li>
          <li><Link style={this.headerLinkStyle()} to="/feed">Feed</Link></li>
          <li><Link style={this.headerLinkStyle()} to="/signup">Sign Up</Link></li>
          <li><Link style={this.headerLinkStyle()} to="/login">Login</Link></li>
        </ul>
      </div>
    );
  }
}

export default Header;
