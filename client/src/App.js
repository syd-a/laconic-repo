import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

import SpeakersIndex from './components/display/SpeakersIndex';
import SpeakerPage from './components/display/SpeakerPage';
import AphorismPage from './components/display/AphorismPage';
import TagPage from './components/display/TagPage';

import SelfAphorisms from './components/self/SelfAphorisms';
import Feed from './components/self/Feed';

class App extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <Route exact path="/" component={Home} />

        <Route path="/index" component={SpeakersIndex} />
        <Route path="/self" component={SelfAphorisms} />
        <Route path="/feed" component={Feed} />
        <Route path="/speakers/:speaker_name" component={SpeakerPage} />
        <Route path="/aphorisms/:aphorism_id" component={AphorismPage} />
        <Route path="/tags/:tag_name" component={TagPage} />

        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
      </div>
    );
  }
}

export default App;
