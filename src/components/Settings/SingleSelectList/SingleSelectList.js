import React from 'react';
import PropTypes from 'prop-types';
import {
  View, FlatList, Text, Image, TouchableHighlight,
} from 'react-native';

// Import Database
import { database } from '../../../database/Database';

// Import Styles
import style from './style';
import themeStyle from '../../shared/colorStyle';
import defaultStyle from '../../shared/defaultStyle';
import defaultHeaderStyle from '../../shared/defaultHeaderStyle';

// Import Icons
const checkedIcon = require('../../../assets/images/checked.png');

export default class SingleSelectList extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.config.name : 'Chose',
      headerStyle: [
        defaultHeaderStyle.header,
        params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
      ],
      headerTintColor: '#18C4E6',
      headerTitleStyle: [defaultHeaderStyle.headerTitle, params.colorMode ? themeStyle.white : themeStyle.light],
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.state = {
      config: navigation.getParam('config', 'empty-config'),
      section: navigation.getParam('section', 'empty-section'),
      colorMode: navigation.getParam('colorMode', 'no-mode'),
    };
  }

  componentWillMount() {
    const { config } = this.state;
    this.setState({
      activeValue: config.value,
    });
  }

  handleToggleRow = (item) => {
    const { refresh, config, section } = this.state;
    const { navigation } = this.props;
    config.value = item;

    this.setState({
      activeValue: item,
      refresh: !refresh,
    });
    database.updateConfig(section, config).then(() => navigation.state.params.refreshConfigList());
  };

  render() {
    const {
      config, activeValue, refresh, colorMode,
    } = this.state;

    return (
      <View style={[defaultStyle.component, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}>
        <FlatList
          data={config.values}
          style={[style.container, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => this.handleToggleRow(item)}
              style={[style.row, colorMode ? [themeStyle.backgroundDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.grayBorder]]}
              underlayColor={colorMode ? '#22354C' : '#ECECED'}
            >
              <View style={[style.rowContainer, colorMode ? themeStyle.darkBorder : themeStyle.grayBorder]}>
                <Text style={[style.rowTitle, colorMode ? themeStyle.white : themeStyle.gray]}>{item.text}</Text>
                {activeValue.id === item.id ? (
                  <View style={defaultStyle.rowIcon}>
                    <Image style={defaultStyle.rowIconImage} source={checkedIcon} />
                  </View>
                ) : (
                  <View />
                )}
              </View>
            </TouchableHighlight>
          )}
          extraData={refresh}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    );
  }
}

SingleSelectList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
