import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, Share, StyleSheet, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// Import database
import { database } from '../database/Database';

export default class NotesScreen extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.parentFolder.title : 'Notes',
      headerStyle: {
        borderBottomWidth: 0,
        height: 50,
        marginBottom: -20
      },
      headerTintColor: '#18C4E6',
      headerTitleStyle: {
        fontWeight: '300',
        fontSize: 25,
        color: '#18C4E6'
      }
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
      <View style={style.mainView}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList={true}
          style={style.container}
          data={this.state.notesData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate('EditNoteScreen', {
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
                  <Image
                    style={{
                      width: 18,
                      height: 18
                    }}
                    source={require('../assets/images/forward.png')}
                  />
                </View>
              </View>
            </TouchableHighlight>
          )}
          renderHiddenItem={(rowData, rowMap) => (
            <View style={style.rowBack}>
              <TouchableOpacity style={[style.backRightBtn, style.backRightBtnLeft]} onPress={_ => this.handleShareNote(rowData.item, rowData.item.id, rowMap)}>
                <Image
                  style={{
                    width: 25,
                    height: 25
                  }}
                  source={require('../assets/images/share-icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnRight]}
                onPress={_ => this.handleDeleteNote(rowData.item, rowData.item.id, rowMap)}
              >
                <Image
                  style={{
                    width: 25,
                    height: 25
                  }}
                  source={require('../assets/images/delete-icon.png')}
                />
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
              this.props.navigation.navigate('AddNoteScreen', {
                parentFolder: this.state.parentFolder,
                refreshNoteList: this.refreshNoteList.bind(this)
              })
            }
          >
            <Image
              style={{
                width: 65,
                height: 65
              }}
              source={require('../assets/images/add.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  mainView: {
    backgroundColor: 'white',
    flex: 1
  },
  container: {
    marginTop: 20,
    borderTopWidth: 0,
    backgroundColor: '#fff'
  },
  row: {
    backgroundColor: '#ffffff',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 7,
    borderBottomColor: '#ECECED',
    borderBottomWidth: 1
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rowView: {
    width: '92%'
  },
  rowTitle: {
    color: '#4A4A4A',
    marginRight: 10,
    paddingBottom: 3,
    fontSize: 19
  },
  rowSubtitle: {
    fontWeight: '300',
    color: '#ccc',
    fontSize: 14
  },
  rowIcon: {
    justifyContent: 'center'
  },
  addButtonView: {
    width: 50,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 15,
    right: 15
  },
  addButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 100,
    alignSelf: 'flex-end'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: '#007aff',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: '#ff3b30',
    right: 0
  }
});
