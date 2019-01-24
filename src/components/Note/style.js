import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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

  backShareIcon: {
    width: 25,
    height: 25,
  },

  backDeleteIcon: {
    width: 30,
    height: 30,
  },

  addButtonView: {
    width: 50,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },

  addButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },

  addButtonImage: {
    width: 65,
    height: 65,
  },
});
