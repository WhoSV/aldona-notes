import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header Style
  addNoteHeaderBackButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  addNoteHeaderBackButtonImage: {
    width: 20,
    height: 20,
    overflow: 'hidden',
    marginLeft: 9,
    marginRight: 6,
    marginVertical: 12,
    resizeMode: 'contain',
    tintColor: '#12C4E6',
  },

  addNoteHeaderBackButtonText: {
    fontSize: 17,
    paddingRight: 10,
    color: '#18C4E6',
  },

  actionButtons: {
    marginRight: 15,
  },

  doneButtonText: {
    color: '#18C4E6',
    fontSize: 18,
  },

  shareButtonText: {
    width: 25,
    height: 25,
  },

  // Component style
  addNoteView: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  addNoteContainer: {
    flex: 1,
    alignItems: 'stretch',
  },

  addNoteEditor: {
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
  },

  imageOptionsContainerStyle: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'transparent',
  },

  imageMenuOptionStyle: {
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },

  imageMenuOptionText: {
    textAlign: 'center',
    color: '#18C4E6',
    fontSize: 18,
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
