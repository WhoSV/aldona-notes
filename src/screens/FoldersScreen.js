import React from 'react';
import {
  View,
  Text,
  AlertIOS,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// Import database
import { database } from '../database/Database';

export default class FoldersScreen extends React.Component {
  // Header Component
  static navigationOptions = {
    title: 'Folders',
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

  constructor(props) {
    super(props);
    this.state = {
      foldersData: []
    };
  }

  componentDidMount() {
    this.refreshFolderList();
  }

  refreshFolderList() {
    return database
      .getAllFolders()
      .then(foldersData => this.setState({ foldersData }));
  }

  handleDeleteFolder(folder, rowKey, rowMap) {
    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    // Get notes count in this folder
    database.getNotesCount(folder).then(notesCount => {
      // Сheck if this folder has zero notes, if no alert user
      if (notesCount === 0 || notesCount === null) {
        database.deleteFolder(folder).then(() => this.refreshFolderList());
      } else {
        AlertIOS.alert(
          'Delete Folder?',
          'If you delete this folder, its notes also will be deleted.',
          [
            {
              text: 'Cancel'
            },
            {
              text: 'Delete',
              onPress: () => {
                database
                  .deleteFolder(folder)
                  .then(() => this.refreshFolderList());
              },
              style: 'destructive'
            }
          ]
        );
      }
    });
  }

  handleUpdateFolder(folder, rowKey, rowMap) {
    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    AlertIOS.prompt(
      'Rename Folder',
      'Enter a new name for this folder.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: newFolderTitle => {
            // if name is same return
            if (newFolderTitle === folder.title) {
              return;
            }
            // Remove spaces from string
            newFolderTitle = newFolderTitle.trim();

            let unique = false;
            this.state.foldersData.map(folder => {
              if (folder.title === newFolderTitle) {
                AlertIOS.alert('Please choose a different folder name');
                return (unique = true);
              }
            });

            if (newFolderTitle !== null && newFolderTitle !== '' && !unique) {
              database
                .updateFolder(folder, newFolderTitle)
                .then(() => this.refreshFolderList());
            }
          }
        }
      ],
      'plain-text',
      (defaultValue = folder.title)
    );
  }

  handleCreateFolder(newFolderTitle) {
    // Remove spaces from string
    newFolderTitle = newFolderTitle.trim();

    let unique = false;
    this.state.foldersData.map(folder => {
      if (folder.title === newFolderTitle) {
        AlertIOS.alert('Please choose a different folder name');
        return (unique = true);
      }
    });

    if (newFolderTitle !== null && newFolderTitle !== '' && !unique) {
      database
        .createFolder(newFolderTitle)
        .then(() => this.refreshFolderList());
    }
  }

  render() {
    return (
      <View style={style.mainView}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList={true}
          style={style.container}
          data={this.state.foldersData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate('NotesScreen', {
                  parentFolder: rowData.item
                })
              }
              style={style.row}
              underlayColor="#ECECED"
            >
              <View style={style.rowContainer}>
                <View style={style.rowView}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={style.rowTitle}
                  >
                    {rowData.item.title}
                  </Text>
                  <Text style={style.rowSubtitle}>
                    {rowData.item.updated_at}
                  </Text>
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
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnLeft]}
                onPress={_ =>
                  this.handleUpdateFolder(rowData.item, rowData.item.id, rowMap)
                }
              >
                <Image
                  style={{
                    width: 25,
                    height: 25
                  }}
                  source={require('../assets/images/edit-icon.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnRight]}
                onPress={_ =>
                  this.handleDeleteFolder(rowData.item, rowData.item.id, rowMap)
                }
              >
                <Image
                  style={{
                    width: 30,
                    height: 30
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

        {/* Add Folder Button Component */}
        <View style={style.addFolderButtonView}>
          <TouchableOpacity
            style={style.addFolderButton}
            onPress={() =>
              AlertIOS.prompt(
                'New Folder',
                'Enter name for new folder.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'OK',
                    onPress: newFolderName =>
                      this.handleCreateFolder(newFolderName)
                  }
                ],
                'plain-text'
              )
            }
          >
            <Text style={style.addFolderButtonText}>New Folder</Text>
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
  },
  addFolderButtonView: {
    height: '8%'
  },
  addFolderButton: {
    alignSelf: 'flex-end',
    paddingTop: 13,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 13
  },
  addFolderButtonText: {
    color: '#18C4E6',
    fontWeight: '400',
    fontSize: 20
  }
});
