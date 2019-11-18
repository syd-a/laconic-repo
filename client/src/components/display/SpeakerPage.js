import React, {Component} from 'react';
import AphorismList from './AphorismList';
import axios from 'axios';

class SpeakerPage extends Component {
  speakerPageStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      fontSize: "1.5rem",
      justifyContent: "center",
      padding: "2rem"
    }
  }

  speakerPageNameStyle = () => {
    return {
      fontSize: "3rem",
      paddingBottom: "1rem"
    }
  }

  speakerPageFollowStyle = () => {
    return {
      color: "grey",
      cursor: "pointer",
      fontSize: "2rem",
      paddingBottom: "1rem"
    }
  }

  speakerPageLoginMessageStyle = () => {
    return {
      color: "grey",
      fontSize: "2rem",
      paddingBottom: "1rem"
    }
  }

  constructor(props) {
    super(props);
    let name = this.props.match.params.speaker_name;
    this.state = {
      name,
      urlPath: "/api/speakers/name/" + name,
      followable: true
    };
    this.onClickFollow = this.onClickFollow.bind(this);
    this.onClickUnfollow = this.onClickUnfollow.bind(this);
  }

  componentDidMount() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    if(hasAuth) {
      axios.get("/api/speakers/self/following")
      .then((res) =>{
        if(res.data) {
          let followingNames = res.data.map(el => el.name);
          this.setState({followable: !followingNames.includes(this.state.name)});
        }
      })
      .catch((err) => {
        //console.log(err);
      })
    }
  }

  onClickFollow() {
    axios.post("/api/speakers/follow", {name: this.state.name})
    .then((res) => {
      this.setState({followable: false});
    })
    .catch((err) => {
      //console.log(err);
    })
  }

  onClickUnfollow() {
    axios.post("/api/speakers/unfollow", {name: this.state.name})
    .then((res) => {
      this.setState({followable: true});
    })
    .catch((err) => {
      //console.log(err);
    })
  }

  followComponent() {
    let headerAuth = axios.defaults.headers.common["Authorization"];
    let hasAuth = (typeof headerAuth) !== "undefined";
    if(hasAuth) {
      if(this.state.followable) {
        return (
          <div
            style={this.speakerPageFollowStyle()}
            onClick={this.onClickFollow}>
            Follow
          </div>
        )
      }else {
        return (
          <div
            style={this.speakerPageFollowStyle()}
            onClick={this.onClickUnfollow}>
            Unfollow
          </div>
        )
      }
    } else {
      return (
        <div style={this.speakerPageLoginMessageStyle()}>
          Sign in to Follow {this.state.name}
        </div>
      )
    }
  }

  render() {
    return (
      <div style={this.speakerPageStyle()}>
        <div style={this.speakerPageNameStyle()}>{this.state.name}</div>
        {this.followComponent()}
        <AphorismList path={this.state.urlPath} />
      </div>
    );
  }
}

export default SpeakerPage;
