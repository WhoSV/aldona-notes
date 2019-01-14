import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';

// Import styles
import style from './style';

export default class SettingsComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerStyle: style.settingsHeaderStyle,
    headerTintColor: '#18C4E6',
    headerTitleStyle: style.settingsHeaderTitleStyle,
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.dispatch(NavigationActions.back())} style={style.actionButtons}>
        <Text style={style.backButtonText}>Back</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={style.settingsContainer}>
        <Text>Settings</Text>
      </View>
    );
  }
}

SettingsComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
