import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, TouchableHighlight, TouchableOpacity, Share, Image,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// Import database
import { database } from '../../database/Database';

// Import styles
import style from './style';

// Import Icons
const forwardIcon = require('../../assets/images/forward.png');
const shareIcon = require('../../assets/images/share.png');
const deleteIcon = require('../../assets/images/delete.png');
const addIcon = require('../../assets/images/add.png');

export default class NoteComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.parentFolder.title : 'Notes',
      headerStyle: style.noteHeaderStyle,
      headerTintColor: '#18C4E6',
      headerTitleStyle: style.noteHeaderTitleStyle,
    };
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;

    this.state = {
      notesData: [],
      parentFolder: navigation.getParam('parentFolder', 'empty-folder'),
    };
  }

  componentDidMount() {
    this.refreshNoteList();
  }

  // Here define item to be shared
  handleShareNote = (note, rowKey, rowMap) => {
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    Share.share({
      message: note.text,
    });
  };

  refreshNoteList() {
    const { parentFolder } = this.state;
    return database.getNotesByFolderId(parentFolder).then(notesData => this.setState({ notesData }));
  }

  handleDeleteNote(note, rowKey, rowMap) {
    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    database.deleteNote(note).then(() => this.refreshNoteList());
  }

  render() {
    const { notesData, parentFolder } = this.state;
    const { navigation } = this.props;

    return (
      <View style={style.noteContainer}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList
          style={style.container}
          data={notesData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() => navigation.navigate('EditNoteComponent', { note: rowData.item, refreshNoteList: this.refreshNoteList.bind(this) })}
              style={style.row}
              underlayColor="#ECECED"
            >
              <View style={style.rowContainer}>
                <View style={style.rowView}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={style.rowTitle}>
                    {rowData.item.text}
                  </Text>
                  <Text style={style.rowSubtitle}>{rowData.item.updatedAt}</Text>
                </View>
                <View style={style.rowIcon}>
                  <Image style={style.rowIconImage} source={forwardIcon} />
                </View>
              </View>
            </TouchableHighlight>
          )}
          renderHiddenItem={(rowData, rowMap) => (
            <View style={style.rowBack}>
              <TouchableOpacity style={[style.backRightBtn, style.backRightBtnLeft]} onPress={_ => this.handleShareNote(rowData.item, rowData.item.id, rowMap)}>
                <Image style={style.backShareIcon} source={shareIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnRight]}
                onPress={_ => this.handleDeleteNote(rowData.item, rowData.item.id, rowMap)}
              >
                <Image style={style.backDeleteIcon} source={deleteIcon} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={rowData => `${rowData.id}`}
          enableEmptySections
          disableRightSwipe
          rightOpenValue={-150}
        />

        {/* Add Note Button Component */}
        <View style={style.addButtonView}>
          <TouchableOpacity
            style={style.addButton}
            onPress={() => navigation.navigate('AddNoteComponent', { parentFolder, refreshNoteList: this.refreshNoteList.bind(this) })}
          >
            <Image style={style.addButtonImage} source={addIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

NoteComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
