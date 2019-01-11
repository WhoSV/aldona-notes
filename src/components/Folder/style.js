import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header style
  folderHeaderStyle: {
    borderBottomWidth: 0,
    height: 50,
    marginBottom: -20
  },

  folderHeaderTitleStyle: {
    fontWeight: '300',
    fontSize: 25,
    color: '#18C4E6'
  },

  // Component style
  folderContainer: {
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

  rowIconImage: {
    width: 18,
    height: 18
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

  backEditIcon: {
    width: 25,
    height: 25
  },

  backDeleteIcon: {
    width: 30,
    height: 30
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
