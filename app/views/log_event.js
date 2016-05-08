import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  ScrollView,
  ActivityIndicatorIOS,
  TextInput,
  CameraRoll,
  NativeModules
} from 'react-native';

var Api = require('../utils/api');
var PubSub = require('../utils/pub_sub');

var styles = StyleSheet.create({
  borders: {
    borderColor: 'grey',
    borderWidth: 2
  },

  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },

  indicator: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  feedContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventInfo: {
    height: 40,
    margin: 10,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1
  },

  createButton: {
    fontSize: 22,
    padding: 5,
    margin: 5
  },

  buttonTouch: {
    margin: 10,
    borderRadius: 5
  },

  imageSelectList: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  imageSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectImageList: {
    height: 60,
    width: 60,
    padding: 10,
    margin: 3
  },

  eventImage: {
    height: 250,
    width: 250,
    padding: 10,
    margin: 3,
    borderWidth: 2,
    borderColor: 'grey'
  }

});

class LogEvent extends React.Component{
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

  storeImages(data) {
    var assets = data.edges;
    var images = assets.map( asset => asset.node.image );
    NativeModules.ReadImageData.readImage(images[0].uri, (data) => { this.setState({ imageData: data  }) } )
    this.setState({images: images, eventImage: images[0].uri});
  }

  logImageError(error) {
    console.log(error);
  }

  componentDidMount() {
    CameraRoll.getPhotos({first: 6}).done(
      (data) => this.storeImages(data)
    )
  }

  selectImage(opts) {
    this.setState({eventImage: opts.selectUri});
    NativeModules.ReadImageData.readImage(opts.selectUri, (data) => { this.setState({ imageData: data }) } );
  }

  renderImages() {
    return this.state.images.map( (image, index) => { 
      return (
        <TouchableHighlight key={`select-image-touch-${index}`} onPress={ this.selectImage.bind(this, {selectUri: image.uri}) } underlayColor='#1F7073'>
          <Image style={styles.selectImageList} key={`select-image-${index}`} source={{uri: image.uri}} />
        </TouchableHighlight>
      )  
    })
  }

  submitEvent() {
    if (this.state.info == null) {
      return null
    } else {
      this.setState({isLoading: true});
      var encodedData = encodeURIComponent(this.state.imageData);
      var body = JSON.stringify({event: {info: this.state.info, imageData: encodedData }})
      console.log('submit Event body', body)
      Api.post('/events', body)
        .then( (res) => {
          this.setState({info: null, isLoading: false});
          PubSub.publish('refreshIndex');
        });
    }
  }

  render() {
    if ( this.state.isLoading == false) {
      return (
        <View>
          <View style={styles.imageSection} >
            <Image style={styles.eventImage} source={{ uri: this.state.eventImage }} />
            <View style={styles.imageSelectList}>
              { this.renderImages() }
            </View>
          </View>
          <TextInput
            keyboardType='default'
            style={styles.eventInfo}
            onChangeText={(text) => this.setState({info: text})}
            value={this.state.info} 
          />
          <TouchableHighlight style={styles.buttonTouch} onPress={ this.submitEvent.bind(this)} underlayColor='#1F7073'>
            <View style={styles.centering} >
                <Text style={styles.createButton} >Create</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    } else {
      return (
        <View style={styles.mainContainer}>
          <View style={styles.indicator}>
            <ActivityIndicatorIOS
              animating={this.state.isLoading}
              color="#1F7073"
              size="large"></ActivityIndicatorIOS>
          </View>
        </View>
      )
    }
  }
};

module.exports = LogEvent;
