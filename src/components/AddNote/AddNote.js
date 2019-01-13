import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TextInput, ScrollView, Keyboard, Dimensions, TouchableOpacity, Text, Share, Image,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// Import database
import { database } from '../../database/Database';

// Import styles
import style from './style';

// Import Icons
const backIcon = require('../../assets/images/back.png');
const shareIcon = require('../../assets/images/share.png');

// Declare for using func inside navigationOptions
let addNoteThis;

export default class AddNoteComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: style.addNoteHeaderStyle,
      headerTintColor: '#18C4E6',
      headerRight: params.action,
      headerLeft: (
        <TouchableOpacity
          style={style.addNoteHeaderBackButton}
          onPress={() => {
            navigation.dispatch(NavigationActions.back());
            addNoteThis.handleAddNote();
          }}
        >
          <Image source={backIcon} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
          <Text style={style.addNoteHeaderBackButtonText}>{params.parentFolder.title.length <= 15 ? params.parentFolder.title : 'Back'}</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    this.state = {
      parentFolder: navigation.getParam('parentFolder', 'empty-folder'),
      text: '',
      visibleHeight: 230,
    };

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentDidMount() {
    addNoteThis = this;
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow(e) {
    const { navigation } = this.props;

    navigation.setParams({
      action: (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={style.actionButtons}
        >
          <Text style={style.doneButtonText}>Done</Text>
        </TouchableOpacity>
      ),
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 100,
    });
  }

  keyboardWillHide() {
    const { text } = this.state;
    const { navigation } = this.props;

    navigation.setParams({
      action: (
        <TouchableOpacity
          onPress={() => Share.share({
            message: text,
          })
          }
          style={style.actionButtons}
        >
          <Image style={style.editButtonText} source={shareIcon} />
        </TouchableOpacity>
      ),
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100,
    });
  }

  // Save note func
  handleAddNote() {
    const { text, parentFolder } = this.state;
    const { navigation } = this.props;

    if (text === null || text === '') {
      console.log('Empty note');
    } else {
      database.createNote(text, parentFolder).then(() => navigation.state.params.refreshNoteList());
    }
  }

  render() {
    const { visibleHeight } = this.state;

    return (
      <View style={style.addNoteContainer}>
        <ScrollView keyboardDismissMode="interactive">
          <TextInput
            onChangeText={text => this.setState({ text })}
            style={{
              height: visibleHeight - 20,
              paddingRight: 15,
              fontSize: 18,
              color: '#4A4A4A',
            }}
            textAlignVertical="top"
            multiline
            autoFocus
          />
        </ScrollView>
      </View>
    );
  }
}

AddNoteComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
