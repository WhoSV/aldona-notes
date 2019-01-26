import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, TouchableHighlight, TouchableOpacity, Share, Image,
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
const shareIcon = require('../../assets/images/share.png');
const deleteIcon = require('../../assets/images/delete.png');
const addIcon = require('../../assets/images/add.png');

export default class NoteComponent extends React.Component {
  // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.parentFolder.title : 'Notes',
      headerStyle: [
        defaultHeaderStyle.header,
        params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
      ],
      headerTintColor: '#18C4E6',
      headerTitleStyle: [defaultHeaderStyle.headerTitle, params.colorMode ? themeStyle.white : themeStyle.light],
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.state = {
      notesData: [],
      parentFolder: navigation.getParam('parentFolder', 'empty-folder'),
      colorMode: navigation.getParam('colorMode', 'no-mode'),
      sortBy: navigation.getParam('sortBy', 'no-sort'),
    };
  }

  componentWillMount() {
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
    const { parentFolder, sortBy } = this.state;
    return database.getNotesByFolderId(parentFolder, sortBy).then(notesData => this.setState({ notesData }));
  }

  handleRowOpen(rowKey, rowMap) {
    this.setState({
      rowKeyOpened: rowKey,
      rowMapOpened: rowMap,
    });
  }

  handleDeleteNote(note, rowKey, rowMap) {
    // Close row on touch button
    rowMap[rowKey] && rowMap[rowKey].closeRow();

    database.deleteNote(note).then(() => this.refreshNoteList());
  }

  render() {
    const {
      notesData, parentFolder, colorMode, rowMapOpened, rowKeyOpened,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={[defaultStyle.component, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}>
        {/* Flat List View */}
        <SwipeListView
          useFlatList
          style={[style.container, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}
          data={notesData}
          renderItem={rowData => (
            <TouchableHighlight
              onPress={() => navigation.navigate('EditNoteComponent', { note: rowData.item, refreshNoteList: this.refreshNoteList.bind(this), colorMode })}
              style={[style.row, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}
              underlayColor={colorMode ? '#22354C' : '#ECECED'}
            >
              <View style={[style.rowContainer, colorMode ? themeStyle.darkBorder : themeStyle.grayBorder]}>
                <View style={style.rowView}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={[style.rowTitle, colorMode ? themeStyle.white : themeStyle.gray]}>
                    {rowData.item.text}
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
            onPress={() => {
              rowMapOpened && rowMapOpened[rowKeyOpened].closeRow(); // close row
              navigation.navigate('AddNoteComponent', { parentFolder, refreshNoteList: this.refreshNoteList.bind(this), colorMode });
            }}
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
