import React, {Component} from 'react';

class Home extends Component {
  descriptionStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      fontSize: "2rem",
      justifyContent: "center",
      lineHeight: "4rem",
      padding: "3rem"
    }
  }

  listStyle = () => {
    return {
      listStylePosition: "inside"
    }
  }

  render() {
    return (
      <div style={this.descriptionStyle()}>
        <p>
          Welcome to Laconic, a Twitter clone constructed with the MERN stack.
          On Laconic, speakers can:
        </p>
        <ul style={this.listStyle()}>
          <li> create, read, and delete 150 character aphorisms </li>
          <li> follow others to obtain a personalized feed </li>
          <li> vote on aphorisms </li>
        </ul>
      </div>
    )
  }
}

export default Home;
