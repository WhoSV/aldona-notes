import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header style
  editNoteHeaderStyle: {
    borderBottomWidth: 0,
    height: 50,
    marginBottom: -20,
  },

  // Component style
  actionButtons: {
    marginRight: 15,
  },

  doneButtonText: {
    color: '#18C4E6',
    fontSize: 18,
  },

  editButtonText: {
    width: 25,
    height: 25,
    tintColor: '#18C4E6',
  },

  editNoteContainer: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
});
