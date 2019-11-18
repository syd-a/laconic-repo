import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class AphorismBox extends Component {
  aphorismBoxStyle = () => {
    return {
      background: "white",
      borderStyle: "solid",
      color: "black",
      display: "inline-block",
      marginBottom: "3rem",
      padding: "1rem",
      width: "40rem",
      wordWrap: "break-word"
    }
  }

  aphorismTextStyle = () => {
    return {
      fontSize: "2rem"
    }
  }

  aphorismSubtextStyle = () => {
    return {
      color: "black",
      fontSize: "1rem",
      lineHeight: "1.5rem"
    }
  }

  aphorismLinkStyle = () => {
    return {
      cursor: "pointer",
      color: "grey"
    }
  }

  aphorismDateStyle = () => {
    return {
      color: "black",
      fontSize: "1rem",
      lineHeight: "2rem",
    }
  }

  constructor(props) {
    super(props);
    this.state = {voted: false, deleted: false};
    this.sendVote = this.sendVote.bind(this);
    this.sendDelete = this.sendDelete.bind(this);
  }

  tagLinks(tagsArr) {
    return (
      tagsArr.map((tagVal) => {
        let tagStr = tagVal.substring(1);
        let tagPath = "/tags/" + tagStr
        return (
          <Link
            style={this.aphorismLinkStyle()}
            key={this.props.aphorism._id + "_TAG_" + tagStr}
            to={{pathname: tagPath, name:tagStr}}>
            {tagVal}&nbsp;
          </Link>
        )
      })
    )
  }

  sendVote() {
    axios.post("/api/aphorisms/id/" + this.props.aphorism._id + "/vote")
    .then((res) => {
      this.setState({voted: true});
    })
    .catch((err) => {
      //
    })
  }

  voteLink() {
    if(!this.props.reader || this.state.voted) {
      return (
        <div> </div>
      )
    }else if(this.props.aphorism.voters.includes(this.props.reader._id)) {
      return (
        <div> </div>
      )
    }else {
      return (
        <div style={this.aphorismLinkStyle()} onClick={this.sendVote}>Add Vote</div>
      )
    }
  }

  sendDelete() {
    axios.delete("/api/aphorisms/id/" + this.props.aphorism._id)
    .then((res) => {
      this.setState({deleted: true});
    })
    .catch((err) => {

    })
  }

  deleteLink() {
    if(!this.props.reader) {
      return (
        <div> </div>
      )
    }else if(this.props.aphorism.speaker_id === this.props.reader._id) {
      return (
        <div style={this.aphorismLinkStyle()} onClick={this.sendDelete}>
          Delete
        </div>
      )
    }
  }

  render() {
    if(this.state.deleted) {
      return (
        <div> </div>
      )
    }
    let speakerName = this.props.aphorism.speaker_name;
    let speakerPath = "/speakers/" + speakerName;
    return (
      <div style={this.aphorismBoxStyle()} key={this.props.aphorism._id}>
        <p style={this.aphorismTextStyle()}>
          {this.props.aphorism.content}
        </p>
        <p style={this.aphorismSubtextStyle()}>
          <b>Speaker: &nbsp;</b>
          <Link style={this.aphorismLinkStyle()} to={{pathname: speakerPath, name: speakerName}}>
            {this.props.aphorism.speaker_name}
          </Link>
        </p>
        <p style={this.aphorismSubtextStyle()}>
          Tags: &nbsp;
          {this.tagLinks(this.props.aphorism.tags)}
        </p>
        <div style={this.aphorismSubtextStyle()}>
          Votes: {this.props.aphorism.votes}
          {this.voteLink()}
        </div>
        <p style={this.aphorismDateStyle()}>
          {this.props.aphorism.date}
        </p>
        {this.deleteLink()}
      </div>
    )
  }
}

export default AphorismBox;
