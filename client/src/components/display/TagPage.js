import React, {Component} from 'react';
import AphorismList from './AphorismList';

class TagPage extends Component {
  tagPageStyle = () => {
    return {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      fontSize: "1.5rem",
      justifyContent: "center",
      padding: "2rem",
    }
  }

  tagPageTitleStyle = () => {
    return {
      fontSize: "3rem",
      paddingBottom: "2rem"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.match.params.tag_name,
      urlPath: "/api/aphorisms/tag/" + this.props.match.params.tag_name
    };
  }

  componentWillReceiveProps(receiveProps){
    if(receiveProps.location.name !== this.state.name) {
      window.location.reload();
    }
  }

  render() {
    return (
      <div style={this.tagPageStyle()}>
        <h1 style={this.tagPageTitleStyle()}>#{this.state.name}</h1>
        <AphorismList path={this.state.urlPath} />
      </div>
    )
  }
}

export default TagPage;
