import React from 'react';
import { View, TextInput, ScrollView, Keyboard, Dimensions, TouchableOpacity, Text, Share, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';

// Import database
import { database } from '../../database/Database';

// Import styles
import style from './style';

// Declare for using func inside navigationOptions
let _this;

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
            _this.handleAddNote();
          }}
        >
          <Image source={require('../../assets/images/back.png')} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
          <Text style={style.addNoteHeaderBackButtonText}>{params.parentFolder.title.length <= 15 ? params.parentFolder.title : 'Back'}</Text>
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      parentFolder: this.props.navigation.getParam('parentFolder', 'empty-folder'),
      text: '',
      visibleHeight: 230,
      height: 0
    };

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  componentDidMount() {
    _this = this;
  }

  keyboardWillShow(e) {
    this.props.navigation.setParams({
      action: (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={style.actionButtons}
        >
          <Text style={style.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 100
    });
  }

  keyboardWillHide() {
    this.props.navigation.setParams({
      action: (
        <TouchableOpacity
          onPress={() =>
            Share.share({
              message: this.state.text
            })
          }
          style={style.actionButtons}
        >
          <Image style={style.editButtonText} source={require('../../assets/images/share.png')} />
        </TouchableOpacity>
      )
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100
    });
  }

  // Save note func
  handleAddNote() {
    if (this.state.text === null || this.state.text === '') {
      console.log('Empty note');
    } else {
      database.createNote(this.state.text, this.state.parentFolder).then(() => this.props.navigation.state.params.refreshNoteList());
    }
  }

  render() {
    return (
      <View style={style.addNoteContainer}>
        <ScrollView keyboardDismissMode="interactive">
          <TextInput
            onChangeText={text => this.setState({ text })}
            style={{
              height: this.state.visibleHeight - 20,
              paddingRight: 15,
              fontSize: 18,
              color: '#4A4A4A'
            }}
            textAlignVertical={'top'}
            multiline={true}
            autoFocus={true}
          />
        </ScrollView>
      </View>
    );
  }
}
