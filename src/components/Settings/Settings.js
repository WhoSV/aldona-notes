import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Text, Image, SectionList, Switch, TouchableHighlight, StatusBar,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// Import database
import { database } from '../../database/Database';

// Import Styles
import style from './style';
import themeStyle from '../shared/colorStyle';
import defaultStyle from '../shared/defaultStyle';
import defaultHeaderStyle from '../shared/defaultHeaderStyle';

// Import Icons
const darkModeIcon = require('../../assets/images/darkMode.png');
const forwardIcon = require('../../assets/images/forward.png');
const sortIcon = require('../../assets/images/sort.png');
const backIcon = require('../../assets/images/back.png');

export default class SettingsComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Settings',
      headerStyle: [
        defaultHeaderStyle.header,
        params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
      ],
      headerTintColor: params.colorMode ? '#fff' : '#18C4E6',
      headerTitleStyle: defaultHeaderStyle.headerTitle,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.dispatch(NavigationActions.back())} style={style.settingsHeaderBackButton}>
          <Image source={backIcon} fadeDuration={0} style={style.settingsHeaderBackButtonImage} />
          <Text style={style.settingsBackButtonText}>Back</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      configs: [],
    };
  }

  componentWillMount() {
    this.refreshConfigList();
  }

  toggleSwitch = (value, section) => {
    const data = section.data[0];
    data.status = value;
    database.updateConfig(section, data).then(() => this.refreshConfigList());
  };

  refreshConfigList() {
    const { navigation } = this.props;

    return database
      .getConfigs()
      .then((configs) => {
        this.setState({ configs, colorMode: configs[0].data[0].status });
      })
      .then(() => {
        const { colorMode } = this.state;

        navigation.setParams({
          colorMode,
        });
      })
      .then(() => navigation.state.params.refreshFolderList());
  }

  render() {
    const { configs, colorMode } = this.state;
    const { navigation } = this.props;

    return (
      <View style={[defaultStyle.component, colorMode ? themeStyle.backgroundSoftDark : themeStyle.backgroundWhite]}>
        <StatusBar barStyle={colorMode ? 'light-content' : 'dark-content'} />
        <SectionList
          style={[style.container, colorMode ? themeStyle.backgroundSoftDark : themeStyle.backgroundWhite]}
          sections={configs}
          renderSectionHeader={({ section }) => (
            <View style={[style.sectionHeaderContainer, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundSoftGray]}>
              <Text style={[style.sectionHeaderText, colorMode ? themeStyle.white : themeStyle.gray]}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item, section }) => (item.type === 'switch' ? (
            <View style={style.rowContainer}>
              <Image style={style.rowImage} source={darkModeIcon} />
              <View style={style.rowContent}>
                <Text style={[style.rowContentName, colorMode ? themeStyle.white : themeStyle.gray]}>{item.name}</Text>
                <Switch
                  style={style.switchStyle}
                  onValueChange={value => this.toggleSwitch(value, section)}
                  value={item.status}
                  trackColor={{ false: '#f7f7f7', true: '#18C4E6' }}
                />
              </View>
            </View>
          ) : (
            <TouchableHighlight
              onPress={() => navigation.navigate('SingleSelectList', {
                config: item,
                section,
                refreshConfigList: this.refreshConfigList.bind(this),
                colorMode,
              })
              }
              underlayColor={colorMode ? '#17212B' : '#ECECED'}
            >
              <View style={style.rowContainer}>
                <Image style={style.rowImage} source={sortIcon} />
                <View style={style.rowContent}>
                  <Text style={[style.rowContentName, colorMode ? themeStyle.white : themeStyle.gray]}>{item.name}</Text>
                  <Text style={style.rowContentValue}>{item.value.text}</Text>
                  <View style={defaultStyle.rowIcon}>
                    <Image style={[defaultStyle.rowIconImage, { marginLeft: 6 }]} source={forwardIcon} />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          ))
          }
          stickySectionHeadersEnabled={false}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    );
  }
}

SettingsComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
