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
	  keyVal: "APHORISM_LIST_" + this.props.match.params.tag_name,
      urlPath: "/api/aphorisms/tag/" + this.props.match.params.tag_name,
	  requiresReload: false,
    };
	this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentWillReceiveProps(receiveProps){
    if(receiveProps.location.name !== this.state.name) {
      this.setState({
		  name: receiveProps.location.name,
	      keyVal: "APHORISM_LIST_" + receiveProps.location.name,
          urlPath: "/api/aphorisms/tag/" + receiveProps.location.name,
		  requiresReload: true
	  });
    }
  }

  render() {
    return (
      <div style={this.tagPageStyle()}>
        <h1 style={this.tagPageTitleStyle()}>#{this.state.name}</h1>
		<AphorismList key={this.state.keyVal} path={this.state.urlPath} />
      </div>
    )
  }
}

export default TagPage;
