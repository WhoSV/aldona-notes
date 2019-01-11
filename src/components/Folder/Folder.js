import React from 'react';
import { View, Text, AlertIOS, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// Import database
import { database } from '../../database/Database';

// Import styles
import style from './style';

export default class FolderComponent extends React.Component {
  // Header Component
  static navigationOptions = {
    title: 'Folders',
    headerStyle: style.folderHeaderStyle,
    headerTintColor: '#18C4E6',
    headerTitleStyle: style.folderHeaderTitleStyle
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
    return database.getAllFolders().then(foldersData => this.setState({ foldersData }));
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
        AlertIOS.alert('Delete Folder?', 'If you delete this folder, its notes also will be deleted.', [
          {
            text: 'Cancel'
          },
          {
            text: 'Delete',
            onPress: () => {
              database.deleteFolder(folder).then(() => this.refreshFolderList());
            },
            style: 'destructive'
          }
        ]);
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
              database.updateFolder(folder, newFolderTitle).then(() => this.refreshFolderList());
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
      database.createFolder(newFolderTitle).then(() => this.refreshFolderList());
    }
  }

  render() {
    return (
      <View style={style.folderContainer}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList={true}
          style={style.container}
          data={this.state.foldersData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate('NoteComponent', {
                  parentFolder: rowData.item
                })
              }
              style={style.row}
              underlayColor="#ECECED"
            >
              <View style={style.rowContainer}>
                <View style={style.rowView}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={style.rowTitle}>
                    {rowData.item.title}
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
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnLeft]}
                onPress={_ => this.handleUpdateFolder(rowData.item, rowData.item.id, rowMap)}
              >
                <Image style={style.backEditIcon} source={require('../../assets/images/edit.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnRight]}
                onPress={_ => this.handleDeleteFolder(rowData.item, rowData.item.id, rowMap)}
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
                    onPress: newFolderName => this.handleCreateFolder(newFolderName)
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
