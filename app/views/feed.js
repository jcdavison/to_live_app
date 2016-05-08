import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  ScrollView,
  ActivityIndicatorIOS,
  NativeModules,
  ListView
} from 'react-native';

var Api = require('../utils/api');
var PubSub = require('../utils/pub_sub');
var moment = require('moment');

var styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    listContainer: {
        height: 600
    },
    info: {
        fontSize: 22
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedImage: {
        height: 345,
        width: 345,
        alignSelf: 'center'
    },
    time: {
        fontSize: 28,
        color: '#1F7073'
    },
    info: {
        fontSize:16,
        marginLeft: 5,
        color: 'grey'
    },
    eventContainer: {
        flex: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
        borderBottomWidth: 3,
        margin: 20,
        flexDirection: 'column',
        backgroundColor: 'white'
    }
});

class Feed extends React.Component{
    componentDidMount() {
        this.setState({isLoading: true});
        PubSub.subscribe('refreshIndex', this.loadBioEvents.bind(this));
        this.loadBioEvents();
    }

    loadBioEvents() {
        Api.get('/events').then( 
                (res) => {
                    this.setState({isLoading: false, eventsList: this.state.eventsList.cloneWithRows(res.events)});
                }
        )
    }

    renderBioEvent(eventObj, sectionID, rowID) {
        return  <View style={styles.eventContainer}>
                    <Image style={styles.feedImage} resizeMode='stretch' source={{ uri: eventObj.photos[0] }} />
                    <Text style={styles.time} > { moment(eventObj.createdAt).format('MMM Do H:mm')} </Text>
                    <Text style={styles.info} > {eventObj.info}</Text> 
                </View>
    }

    constructor(props) {
        super(props);
        var eventsList = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => { return newRow }
        });
        this.state = {
            eventsList: eventsList.cloneWithRows([]),
            isLoading: false
        }
    }

    render() {
        if ( this.state.isLoading == false) {
            return(
                <View>
                    <ListView 
                        style={styles.listContainer}
                        enableEmptySections={true}
                        dataSource={this.state.eventsList} 
                        renderRow={this.renderBioEvent} />
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

module.exports = Feed;
