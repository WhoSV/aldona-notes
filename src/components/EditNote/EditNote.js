import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TextInput, ScrollView, Keyboard, Dimensions, TouchableOpacity, Text, Share, Image,
} from 'react-native';

// Import Database
import { database } from '../../database/Database';

// Import Styles
import style from './style';
import themeStyle from '../shared/styles/colorStyle';
import defaultHeaderStyle from '../shared/styles/defaultHeaderStyle';

// Import Icons
const shareIcon = require('../../assets/images/share.png');

export default class EditNoteComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerStyle: [
        defaultHeaderStyle.header,
        params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
      ],
      headerTintColor: '#18C4E6',
      headerRight: params.action,
      headerTruncatedBackTitle: 'Back',
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.state = {
      noteToUpdate: navigation.getParam('note', 'empty-note'),
      colorMode: navigation.getParam('colorMode', 'no-mode'),
      text: '',
      visibleHeight: 230,
    };

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentWillMount() {
    const { noteToUpdate } = this.state;

    this.setState({
      text: noteToUpdate.text,
    });
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow(e) {
    const { navigation } = this.props;

    navigation.setParams({
      action: (
        <TouchableOpacity onPress={() => Keyboard.dismiss()} style={style.actionButtons}>
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

    this.handleEditNote();

    let shareButtonColor = '#18C4E6';
    if (!text) {
      shareButtonColor = '#ccc';
    }

    navigation.setParams({
      action: (
        <TouchableOpacity
          disabled={!text}
          onPress={() => Share.share({
            message: text,
          })
          }
          style={style.actionButtons}
        >
          <Image style={[style.shareButtonText, { tintColor: shareButtonColor }]} source={shareIcon} />
        </TouchableOpacity>
      ),
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100,
    });
  }

  handleEditNote() {
    const { text, noteToUpdate } = this.state;
    const { navigation } = this.props;

    if (text === null || text === '') {
      database.deleteNote(noteToUpdate).then(() => navigation.state.params.refreshNoteList());
    } else {
      database.updateNote(text, noteToUpdate).then(() => navigation.state.params.refreshNoteList());
    }
  }

  render() {
    const { text, visibleHeight, colorMode } = this.state;

    return (
      <View style={[style.editNoteContainer, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}>
        <ScrollView keyboardDismissMode="on-drag">
          <TextInput
            value={text}
            onChangeText={newText => this.setState({ text: newText })}
            style={{
              height: visibleHeight - 20,
              paddingRight: 15,
              fontSize: 18,
              color: colorMode ? '#ffffff' : '#4A4A4A',
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

EditNoteComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
