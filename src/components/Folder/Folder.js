import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, AlertIOS, TouchableHighlight, TouchableOpacity, Image,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// Import database
import { database } from '../../database/Database';

// Import styles
import style from './style';

// Import Icons
const forwardIcon = require('../../assets/images/forward.png');
const editIcon = require('../../assets/images/edit.png');
const deleteIcon = require('../../assets/images/delete.png');

export default class FolderComponent extends React.Component {
  // Header Component
  static navigationOptions = {
    title: 'Folders',
    headerStyle: style.folderHeaderStyle,
    headerTintColor: '#18C4E6',
    headerTitleStyle: style.folderHeaderTitleStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      foldersData: [],
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
    database.getNotesCount(folder).then((notesCount) => {
      // Сheck if this folder has zero notes, if no alert user
      if (notesCount === 0 || notesCount === null) {
        database.deleteFolder(folder).then(() => this.refreshFolderList());
      } else {
        AlertIOS.alert('Delete Folder?', 'If you delete this folder, its notes also will be deleted.', [
          { text: 'Cancel' },
          {
            text: 'Delete',
            onPress: () => {
              database.deleteFolder(folder).then(() => this.refreshFolderList());
            },
            style: 'destructive',
          },
        ]);
      }
    });
  }

  handleUpdateFolder(folder, rowKey, rowMap) {
    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    const { foldersData } = this.state;

    AlertIOS.prompt(
      'Rename Folder',
      'Enter a new name for this folder.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (newFolderTitle) => {
            // if name is same return
            if (newFolderTitle === folder.title) {
              return;
            }
            // Remove spaces from string
            const newFolder = newFolderTitle.trim();

            let unique = false;
            foldersData.map((item) => {
              if (item.title === newFolder) {
                AlertIOS.alert('Please choose a different folder name');
                unique = true;
                return unique;
              }
              return false;
            });

            if (newFolder !== null && newFolder !== '' && !unique) {
              database.updateFolder(folder, newFolder).then(() => this.refreshFolderList());
            }
          },
        },
      ],
      'plain-text',
      folder.title,
    );
  }

  handleCreateFolder(newFolderTitle) {
    // Remove spaces from string
    const newFolder = newFolderTitle.trim();

    let unique = false;
    const { foldersData } = this.state;

    foldersData.map((folder) => {
      if (folder.title === newFolder) {
        AlertIOS.alert('Please choose a different folder name');
        unique = true;
        return unique;
      }
      return false;
    });

    if (newFolder !== null && newFolder !== '' && !unique) {
      database.createFolder(newFolder).then(() => this.refreshFolderList());
    }
  }

  render() {
    const { foldersData } = this.state;
    const { navigation } = this.props;

    return (
      <View style={style.folderContainer}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList
          style={style.container}
          data={foldersData}
          renderItem={rowData => (
            <TouchableHighlight onPress={() => navigation.navigate('NoteComponent', { parentFolder: rowData.item })} style={style.row} underlayColor="#ECECED">
              <View style={style.rowContainer}>
                <View style={style.rowView}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={style.rowTitle}>
                    {rowData.item.title}
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
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnLeft]}
                onPress={_ => this.handleUpdateFolder(rowData.item, rowData.item.id, rowMap)}
              >
                <Image style={style.backEditIcon} source={editIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.backRightBtn, style.backRightBtnRight]}
                onPress={_ => this.handleDeleteFolder(rowData.item, rowData.item.id, rowMap)}
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

        {/* Add Folder Button Component */}
        <View style={style.addFolderButtonView}>
          <TouchableOpacity
            style={style.addFolderButton}
            onPress={() => AlertIOS.prompt(
              'New Folder',
              'Enter name for new folder.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: newFolderName => this.handleCreateFolder(newFolderName),
                },
              ],
              'plain-text',
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

FolderComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
