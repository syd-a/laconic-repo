import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Follow extends Component {
  followListStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      listStyleType: "none"
    }
  }

  followListItemStyle = () => {
    return {
      paddingRight: "0.5rem"
    }
  }

  followLinkStyle = () => {
    return {
      color: "grey"
    }
  }

  followTextStyle = () => {
    return {
      textAlign: "center"
    }
  }

  constructor(props) {
    super(props);
    this.state = {follows: []};
  }

  componentDidMount() {
    axios.get("/api/speakers/self/following")
    .then((res) => {
      if(res.data) {
        let followArr = []
        res.data.map((ele) => {
          followArr.push(ele);
          this.setState({follows: followArr});
        });
      }
    })
    .catch((err) => {
      //console.log(err);
    });
  }

  mapToItems() {
    if(this.state && (this.state.follows.length > 0)) {
      return (
        <div>
          <p style={this.followTextStyle()}> You are following: </p>
          <ul style={this.followListStyle()}>
            {this.state.follows.map((ele) => {
              return (
                <li style={this.followListItemStyle()} key={ele.name}>
                  <Link
                    style={this.followLinkStyle()}
                    key={ele._id}
                    to={"/speakers/" + ele.name}
                    >
                    {ele.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <p>
            You are not currently following anyone.
            Follow speakers to see their aphorisms in your feed.
          </p>
        </div>
      )
    }
  }

  render() {
    return (
      this.mapToItems()
    )
  }
}

export default Follow;
