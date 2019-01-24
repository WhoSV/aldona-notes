import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header style
  folderHeaderSettingsButtonImage: {
    width: 25,
    height: 25,
    overflow: 'hidden',
    marginLeft: 9,
    marginRight: 6,
    marginVertical: 12,
    resizeMode: 'contain',
    tintColor: '#12C4E6',
  },

  // Component style
  container: {
    marginTop: 20,
    borderTopWidth: 0,
  },

  row: {
    paddingTop: 10,
    paddingLeft: 20,
  },

  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },

  rowView: {
    flex: 1,
    justifyContent: 'space-between',
  },

  rowTitle: {
    color: '#4A4A4A',
    marginRight: 10,
    paddingBottom: 3,
    fontSize: 19,
  },

  rowSubtitle: {
    fontWeight: '300',
    color: '#ccc',
    fontSize: 14,
  },

  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },

  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },

  backRightBtnLeft: {
    backgroundColor: '#007aff',
    right: 75,
  },

  backRightBtnRight: {
    backgroundColor: '#ff3b30',
    right: 0,
  },

  backEditIcon: {
    width: 25,
    height: 25,
  },

  backDeleteIcon: {
    width: 30,
    height: 30,
  },

  addFolderButtonView: {
    height: '8%',
  },

  addFolderButton: {
    alignSelf: 'flex-end',
    paddingTop: 13,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 13,
  },

  addFolderButtonText: {
    color: '#18C4E6',
    fontWeight: '400',
    fontSize: 20,
  },
});
