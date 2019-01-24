import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header Style
  addNoteHeaderBackButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  addNoteHeaderBackButtonImage: {
    width: 13,
    height: 21,
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
  addNoteContainer: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 15,
  },
});
