import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class SpeakersIndex extends Component {
  indexStyle = () => {
    return {
      display: "flex",
      flexWrap: "wrap",
      fontSize: "2rem",
      justifyContent: "space-around",
      lineHeight: "4rem",
      listStyleType: "none",
      padding: "2rem",
      paddingTop: "0"
    }
  }

  indexHeaderStyle = () => {
    return {
      display: "flex",
      fontSize: "3rem",
      justifyContent: "space-around",
      paddingTop: "2rem"
    }
  }

  indexItemStyle = () => {
    return {
      padding: "2rem"
    }
  }

  indexLinkStyle = () => {
    return {
      color: "grey"
    }
  }

  indexButtonStyle = () => {
    return {
      backgroundColor: "black",
      borderColor: "white",
      borderRadius: "10px",
      color: "white",
      fontSize: "3rem",
      padding: "1rem",
      width: "100%"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      indexState: [],
      limit: 10,
      skip: 0,
      completed: false
    };
    this.speakerItem = this.speakerItem.bind(this);
    this.getMore = this.getMore.bind(this);
  }

  render() {
    return (
      <div>
        <h1 style={this.indexHeaderStyle()}>Index of Speakers</h1>
        {this.mapIndexToItems()}
      </div>
    );
  }

  componentDidMount() {
    this.getIndex();
  }

  getIndex() {
    axios.post("/api/speakers/index",
      {"limit": String(this.state.limit)}
    )
    .then((speakers) => {
      let speakersArray = [];
      speakers.data.map((speaker) => {
        speakersArray.push(speaker);
        this.setState({indexState: speakersArray});
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  speakerItem(speaker) {
    let pathStr = "/speakers/" + speaker.name;
    return (
      <li style={this.indexItemStyle()} key={speaker._id}>
        <Link style={this.indexLinkStyle()} to={pathStr}>{speaker.name}</Link>
      </li>
    );
  }

  getMore(e) {
    e.preventDefault();
    let nextSkip = this.state.skip + this.state.limit;

    axios.post("/api/speakers/index",
      {
        limit: this.state.limit,
        skip: nextSkip
      }
    )
    .then((speakers) => {
      let speakersArray = this.state.indexState;

      if(speakers.data.length > 0) {
        speakers.data.map((speaker) => {
          speakersArray.push(speaker);
          this.setState({indexState: speakersArray});
        });

        this.setState({skip: nextSkip});
      }

      if(speakers.data.length < this.state.limit) {
        this.setState({completed: true});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  mapIndexToItems() {
    if(this.state) {
      return (
        <ul style={this.indexStyle()}>
          {this.state.indexState.map(this.speakerItem)}
          <li style={this.indexItemStyle()} key="moreButton">
            <button style={this.indexButtonStyle()} onClick={this.getMore}>
              {
                this.state.completed ?
                "No More Found. Try Again?" :
                "Load More"
              }
            </button>
          </li>
        </ul>
      );
    }
  }
}

export default SpeakersIndex;
