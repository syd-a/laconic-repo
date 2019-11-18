import React, {Component} from 'react';
import AphorismBox from './AphorismBox';
import axios from 'axios';

class AphorismList extends Component {
  aphorismListPageStyle = () => {
    return {
      display: "flex",
      flexDirection: "column",
      fontSize: "2rem",
      lineHeight: "3rem",
      listStyleType: "none",
      textAlign: "center",
      padding: "2rem",
      paddingTop: "0rem"
    }
  }

  aphorismListButtonStyle = () => {
    return {
      backgroundColor: "black",
      borderColor: "white",
      borderRadius: "10px",
      color: "white",
      fontSize: "3rem",
      padding: "1rem",
    }
  }

  postFormStyle = () => {
    return {
      display: "flex",
      flexDirection: "column",
      listStyleType: "none",
      marginBottom: "3rem",
      textAlign: "center"
    }
  }

  postFieldStyle = () => {
    return {
      borderRadius: "20px",
      display: "inline-block",
      fontFamily: "\"Gill Sans\", sans-serif",
      fontSize: "2rem",
      height: "8rem",
      lineHeight: "1.5rem",
      margin: "1rem",
      padding: "0.25rem",
      textAlign: "left",
      width: "95%",
    }
  }

  postButtonStyle = () => {
    return {
      backgroundColor: "black",
      borderColor: "white",
      borderRadius: "20px",
      color: "white",
      fontSize: "2rem",
      padding: "0.25rem",
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      aphorismsHash: {},
      aphorismsList: [],
      path: this.props.path,
      limit: 10,
      skip: 0,
      increment: 10,
      completed: false,
      aphorismContent: "",
      reader: null
    };
    this.getMore = this.getMore.bind(this);
    this.onPostChange = this.onPostChange.bind(this);
    this.onPostSubmit = this.onPostSubmit.bind(this);
    this.aphorismItem = this.aphorismItem.bind(this);
  }

  getList() {
    axios.post(this.state.path,
      {limit: this.state.limit}
    )
    .then((aphorisms) => {
      if(aphorisms.data) {
        let aphList = this.state.aphorismsList;
        let hasMore = false;

        aphorisms.data.map((aphorism) => {
          if(!this.state.aphorismsHash[aphorism._id]) {
            aphList.push(aphorism);
            let nextHash = this.state.aphorismsHash;
            nextHash[aphorism._id] = true;
            this.setState({aphorismsList: aphList, aphorismsHash: nextHash});
            hasMore = true;
          }
        });

        if(hasMore) {
          let nextLimit = this.state.limit + this.state.increment;
          this.setState({limit: nextLimit});
        } else {
          this.setState({completed: true});
        }
      }
    })
  }

  componentDidMount() {
    axios.get("/api/speakers/self/info")
    .then((res) => {
      if(res.data) {
        this.setState({reader: res.data});
      }
    })
    .catch((err) => {
      //console.log(err);
    })

    this.getList();
  }

  aphorismItem(aph) {
    return (
      <AphorismBox key={"BOX_" + aph._id} aphorism={aph} reader={this.state.reader} />
    )
  }

  getMore(e) {
    e.preventDefault();

    this.getList();
  }

  mapToItems() {
    if(this.state) {
      return (
        <ul style={this.aphorismListPageStyle()}>
          {this.state.aphorismsList.map(this.aphorismItem)}
          <li key="moreButton">
            <button style={this.aphorismListButtonStyle()} onClick={this.getMore}>
              {
                this.state.completed ?
                "No More Found. Try Again?" :
                "Load More"
              }
            </button>
          </li>
        </ul>
      )
    }
  }

  onPostChange(e) {
    e.preventDefault();
    this.setState({aphorismContent: e.target.value})
  }

  onPostSubmit(e) {
    e.preventDefault();
    if(this.state.aphorismContent.length < 1) {
      return 0;
    }

    let content = this.state.aphorismContent;
    axios.post(this.props.postURL, {content: content})
    .then((res) => {
      if(res.data) {
        this.setState({aphorismContent: ""});
        this.getList();
      }
    })
    .catch((err) => {
      //console.log(err);
    })
  }

  postForm() {
    return (
      <div>
        <form style={this.postFormStyle()} onSubmit={this.onPostSubmit}>
          <textarea
            style={this.postFieldStyle()}
            value={this.state.aphorismContent}
            onChange={this.onPostChange}
          />
          <input
            style={this.postButtonStyle()}
            type="submit"
            value="Submit New Aphorism"
          />
        </form>
      </div>
    )
  }

  blank() {
    return (
      <div>
      </div>
    )
  }

  render() {
    return(
      <div>
        {this.props.postURL ? this.postForm() : this.blank()}
        {this.mapToItems()}
      </div>
    )
  }
}

export default AphorismList;
