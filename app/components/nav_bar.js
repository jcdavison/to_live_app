var Api = require('../utils/api');
var PubSub = require('../utils/pub_sub');

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

var styles = StyleSheet.create({
    mainContainer:{
        flex:1
    },

    toolbar:{
        backgroundColor:'#237B7E',
        paddingTop:20,
        paddingBottom:10,
        flexDirection:'row',
    },

    toolbarButton:{
        width: 130,
        fontSize: 16,
        padding: 5,
        color:'#fff',
        textAlign:'center'
    },

    toolbarTitle:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1,
        fontSize: 18,
        padding: 5
    },
});

class NavBar extends React.Component{
    navigateTo(opts) {
        var routeId = opts.view == 'Feed' ? 1 : 0
        if (routeId == 1) { PubSub.publish('refreshIndex');}
        this.props.navigator.jumpTo(this.props.navigator.getCurrentRoutes()[routeId])
    }

    render() {
        return (
            <View style={styles.toolbar}>
                <TouchableHighlight onPress={ this.navigateTo.bind(this, {view: 'Feed'})} underlayColor='white'>
                    <Text style={styles.toolbarButton}>Feed</Text>
                </TouchableHighlight>
                <Text style={styles.toolbarTitle}>BioStream</Text>
                <TouchableHighlight onPress={ this.navigateTo.bind(this, {view: 'LogEvent'})} underlayColor='white'>
                    <Text style={styles.toolbarButton}>Log Event</Text>
                </TouchableHighlight>
            </View>
        )
    }
};

module.exports = NavBar;
