import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header style
  noteHeaderStyle: {
    borderBottomWidth: 0,
    height: 50,
    marginBottom: -20
  },

  noteHeaderTitleStyle: {
    fontWeight: '300',
    fontSize: 25,
    color: '#18C4E6'
  },

  // Component style
  noteContainer: {
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

  backShareIcon: {
    width: 25,
    height: 25
  },

  backDeleteIcon: {
    width: 25,
    height: 25
  },

  addButtonView: {
    width: 50,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 15,
    right: 15
  },

  addButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 100,
    alignSelf: 'flex-end'
  },

  addButtonImage: {
    width: 65,
    height: 65
  }
});
