import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, Share, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// Import database
import { database } from '../../database/Database';

// Import styles
import style from './style';

export default class NoteComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.parentFolder.title : 'Notes',
      headerStyle: style.noteHeaderStyle,
      headerTintColor: '#18C4E6',
      headerTitleStyle: style.noteHeaderTitleStyle
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      notesData: [],
      parentFolder: this.props.navigation.getParam('parentFolder', 'empty-folder')
    };
  }

  componentDidMount() {
    this.refreshNoteList();
  }

  refreshNoteList() {
    return database.getNotesByFolderId(this.state.parentFolder).then(notesData => this.setState({ notesData }));
  }

  handleDeleteNote(note, rowKey, rowMap) {
    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    database.deleteNote(note).then(() => this.refreshNoteList());
  }

  // Here define item to be shared
  handleShareNote(note, rowKey, rowMap) {
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    Share.share({
      message: note.text
    });
  }

  render() {
    return (
      <View style={style.noteContainer}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList={true}
          style={style.container}
          data={this.state.notesData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate('EditNoteComponent', {
                  note: rowData.item,
                  refreshNoteList: this.refreshNoteList.bind(this)
                })
              }
              style={style.row}
              underlayColor="#ECECED"
            >
              <View style={style.rowContainer}>
                <View style={style.rowView}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={style.rowTitle}>
                    {rowData.item.text}
                  </Text>
                  <Text style={style.rowSubtitle}>{rowData.item.updated_at}</Text>
                </View>
                <View style={style.rowIcon}>
                  <Image style={style.rowIconImage} source={require('../../assets/images/forward.png')} />
                </View>
              </View>
            </TouchableHighlight>
          )}
          renderHiddenItem={(rowData, rowMap) => (
            <View style={style.rowBack}>
              <TouchableOpacity style={[style.backRightBtn, style.backRightBtnLeft]} onPress={_ => this.handleShareNote(rowData.item, rowData.item.id, rowMap)}>
                <Image style={style.backShareIcon} source={require('../../assets/images/share.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnRight]}
                onPress={_ => this.handleDeleteNote(rowData.item, rowData.item.id, rowMap)}
              >
                <Image style={style.backDeleteIcon} source={require('../../assets/images/delete.png')} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={rowData => '' + rowData.id}
          enableEmptySections={true}
          disableRightSwipe={true}
          rightOpenValue={-150}
        />

        {/* Add Note Button Component */}
        <View style={style.addButtonView}>
          <TouchableOpacity
            style={style.addButton}
            onPress={() =>
              this.props.navigation.navigate('AddNoteComponent', {
                parentFolder: this.state.parentFolder,
                refreshNoteList: this.refreshNoteList.bind(this)
              })
            }
          >
            <Image style={style.addButtonImage} source={require('../../assets/images/add.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
