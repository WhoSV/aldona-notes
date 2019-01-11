import React from 'react';
import { View, TextInput, StyleSheet, ScrollView, Keyboard, Dimensions, TouchableOpacity, Text, Share, Image } from 'react-native';

// Import database
import { database } from '../database/Database';

export default class EditNoteScreen extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        borderBottomWidth: 0,
        height: 50,
        marginBottom: -20
      },
      headerTintColor: '#18C4E6',
      headerRight: params.action,
      headerTruncatedBackTitle: 'Back'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      noteToUpdate: this.props.navigation.getParam('note', 'empty-note'),
      text: '',
      visibleHeight: 230,
      height: 0
    };

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentWillMount() {
    this.setState({
      text: this.state.noteToUpdate.text
    });
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow(e) {
    this.props.navigation.setParams({
      action: (
        <TouchableOpacity onPress={() => Keyboard.dismiss()} style={{ marginRight: 15 }}>
          <Text style={{ color: '#18C4E6', fontSize: 18 }}>Done</Text>
        </TouchableOpacity>
      )
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 100
    });
  }

  keyboardWillHide() {
    this.handleEditNote();

    this.props.navigation.setParams({
      action: (
        <TouchableOpacity
          onPress={() =>
            Share.share({
              message: this.state.text
            })
          }
          style={{ marginRight: 15 }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: '#18C4E6'
            }}
            source={require('../assets/images/share-icon.png')}
          />
        </TouchableOpacity>
      )
    });
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100
    });
  }

  handleEditNote() {
    console.log(this.state.noteToUpdate);
    console.log(this.state.text);
    if (this.state.text === null || this.state.text === '') {
      database.deleteNote(this.state.noteToUpdate).then(() => this.props.navigation.state.params.refreshNoteList());
    } else {
      database.updateNote(this.state.text, this.state.noteToUpdate).then(() => this.props.navigation.state.params.refreshNoteList());
    }
  }

  render() {
    return (
      <View style={styles.textAreaContainer}>
        <ScrollView keyboardDismissMode="interactive">
          <TextInput
            value={this.state.text}
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

const styles = StyleSheet.create({
  textAreaContainer: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#fff'
  }
});
