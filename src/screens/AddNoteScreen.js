import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  Text,
  Share,
  Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// Import database
import { database } from '../database/Database';

// Declare for using func inside navigationOptions
let _this;

export default class AddNoteScreen extends React.Component {
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
      headerLeft: (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            flexDirection: 'row'
          }}
          onPress={() => {
            navigation.dispatch(NavigationActions.back());
            _this.handleAddNote();
          }}
        >
          <Image
            source={require('../assets/images/back.png')}
            fadeDuration={0}
            style={{
              width: 13,
              height: 21,
              overflow: 'hidden',
              marginLeft: 9,
              marginRight: 6,
              marginVertical: 12,
              resizeMode: 'contain',
              tintColor: '#12C4E6'
            }}
          />
          <Text
            style={{
              fontSize: 17,
              paddingRight: 10,
              color: '#18C4E6'
            }}
          >
            {params.parentFolder.title.length <= 15
              ? params.parentFolder.title
              : 'Back'}
          </Text>
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      parentFolder: this.props.navigation.getParam(
        'parentFolder',
        'empty-folder'
      ),
      text: '',
      visibleHeight: 230,
      height: 0
    };

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    );
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
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#18C4E6', fontSize: 18 }}>Done</Text>
        </TouchableOpacity>
      )
    });
    this.setState({
      visibleHeight:
        Dimensions.get('window').height - e.endCoordinates.height - 100
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

  // Save note func
  handleAddNote() {
    if (this.state.text === null || this.state.text === '') {
      console.log('Empty note');
    } else {
      database
        .createNote(this.state.text, this.state.parentFolder)
        .then(() => this.props.navigation.state.params.refreshNoteList());
    }
  }

  render() {
    return (
      <View style={styles.textAreaContainer}>
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

const styles = StyleSheet.create({
  textAreaContainer: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#fff'
  }
});
