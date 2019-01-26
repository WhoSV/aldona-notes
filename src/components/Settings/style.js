import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Header style
  settingsHeaderBackButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  settingsHeaderBackButtonImage: {
    width: 13,
    height: 21,
    overflow: 'hidden',
    marginLeft: 9,
    marginRight: 6,
    marginVertical: 12,
    resizeMode: 'contain',
  },

  settingsBackButtonText: {
    fontSize: 17,
    paddingRight: 10,
    color: '#18C4E6',
  },

  // Component style
  container: {
    marginTop: 20,
    borderTopWidth: 0,
  },

  sectionHeaderContainer: {
    paddingTop: 30,
    paddingBottom: 10,
  },

  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 15,
  },

  rowContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 15,
  },

  rowImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginLeft: 16,
  },

  rowContent: {
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rowContentName: {
    fontSize: 16,
  },

  rowContentValue: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '300',
    marginLeft: 'auto',
  },

  switchStyle: {
    width: 60,
    marginRight: 6,
    marginLeft: 6,
  },
});
