import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  CameraRoll,
  NativeModules,
  Navigator,
  View
} from 'react-native';

var NavBar = require('./app/components/nav_bar');
var Feed = require('./app/views/feed');
var LogEvent = require('./app/views/log_event');
var PubSub = require('./app/utils/pub_sub');

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    contentContainer: {
        height: 600
    }
});

class ToLiveApp extends Component {

  constructor(props) {
      super(props);
      this.state = {
          info: null,
          isLoading: false,
          images: [],
          eventImage: '',
          imageData: null,
          s3Data: null
      }
  }

  feedView() {
      return {component: Feed, navigationBar: NavBar, index: 0 } 
  }

  logEventView() {
      return {component: LogEvent, navigationBar: NavBar, index: 1 } 
  }

  renderScene(route, navigator) {
      return(
          <View style={styles.mainContainer}>
              <View>
                  <route.navigationBar navigator={navigator}/>
              </View>
              <View style={styles.contentContainer}>
                  <route.component />
              </View>
          </View>
      )
  }

  render() {
      return (
          <Navigator initialRouteStack={[this.logEventView(), this.feedView()]} renderScene={ this.renderScene } />
      );
  }
}

AppRegistry.registerComponent('ToLiveApp', () => ToLiveApp);
