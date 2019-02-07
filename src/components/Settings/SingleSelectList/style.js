import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Component style
  container: {
    marginTop: 40,
    borderTopWidth: 0,
  },

  row: {
    paddingTop: 10,
    paddingLeft: 20,
  },

  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingRight: 5,
    borderBottomWidth: 1,
  },

  rowTitle: {
    marginRight: 10,
    paddingBottom: 3,
    fontSize: 16,
  },
});
