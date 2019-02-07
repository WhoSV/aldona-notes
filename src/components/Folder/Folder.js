import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, AlertIOS, TouchableHighlight, TouchableOpacity, Image, StatusBar,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Moment from 'moment';

// Import Database
import { database } from '../../database/Database';

// Import Styles
import style from './style';
import themeStyle from '../shared/styles/colorStyle';
import defaultStyle from '../shared/styles/defaultStyle';
import defaultHeaderStyle from '../shared/styles/defaultHeaderStyle';

// Import Icons
const forwardIcon = require('../../assets/images/forward.png');
const editIcon = require('../../assets/images/edit.png');
const deleteIcon = require('../../assets/images/delete.png');
const settingsIcon = require('../../assets/images/settings.png');

// Declare for using func inside navigationOptions
let folderThis;

export default class FolderComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Folders',
      headerStyle: [
        defaultHeaderStyle.header,
        params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
      ],
      headerTintColor: params.colorMode ? '#fff' : '#18C4E6',
      headerTitleStyle: defaultHeaderStyle.headerTitle,
      headerLeft: (
        <TouchableOpacity
          style={style.addNoteHeaderBackButton}
          onPress={() => {
            folderThis.navigateToSettings();
          }}
        >
          <Image source={settingsIcon} fadeDuration={0} style={style.folderHeaderSettingsButtonImage} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      foldersData: [],
    };
  }

  componentWillMount() {
    this.refreshFolderList();
  }

  componentDidMount() {
    folderThis = this;
  }

  getConfigs() {
    return database
      .getConfigs()
      .then((configs) => {
        this.setState({ colorMode: configs[0].data[0].status, sortBy: configs[1].data[0].value.order });
      })
      .then(() => {
        const { colorMode } = this.state;
        const { navigation } = this.props;

        navigation.setParams({
          colorMode,
        });
      });
  }

  navigateToSettings() {
    const { navigation } = this.props;

    navigation.navigate('SettingsComponent', { refreshFolderList: folderThis.refreshFolderList.bind(this) });
  }

  refreshFolderList() {
    this.getConfigs();
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
    const { foldersData } = this.state;

    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

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

  handleRowOpen(rowKey, rowMap) {
    this.setState({
      rowKeyOpened: rowKey,
      rowMapOpened: rowMap,
    });
  }

  handleCreateFolder(newFolderTitle) {
    // Remove spaces from string
    const newFolder = newFolderTitle.trim();
    const { foldersData } = this.state;
    let unique = false;

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
    const {
      foldersData, colorMode, sortBy, rowMapOpened, rowKeyOpened,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={[defaultStyle.component, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}>
        <StatusBar barStyle={colorMode ? 'light-content' : 'dark-content'} />
        {/* Flat List View */}
        <SwipeListView
          useFlatList
          style={[style.container, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}
          data={foldersData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() => navigation.navigate('NoteComponent', { parentFolder: rowData.item, colorMode, sortBy })}
              style={[style.row, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}
              underlayColor={colorMode ? '#22354C' : '#ECECED'}
            >
              <View style={[style.rowContainer, colorMode ? themeStyle.darkBorder : themeStyle.grayBorder]}>
                <View style={style.rowView}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={[style.rowTitle, colorMode ? themeStyle.white : themeStyle.gray]}>
                    {rowData.item.title}
                  </Text>
                  <Text style={style.rowSubtitle}>{Moment(rowData.item.updatedAt).calendar()}</Text>
                </View>
                <View style={defaultStyle.rowIcon}>
                  <Image style={defaultStyle.rowIconImage} source={forwardIcon} />
                </View>
              </View>
            </TouchableHighlight>
          )}
          onRowOpen={(rowData, rowMap) => this.handleRowOpen(rowData, rowMap)}
          renderHiddenItem={(rowData, rowMap) => (
            <View style={[style.rowBack, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}>
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
            onPress={() => {
              rowMapOpened && rowMapOpened[rowKeyOpened].closeRow(); // close row func
              AlertIOS.prompt(
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
              );
            }}
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
