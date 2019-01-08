import React from 'react';
import { AppState, Platform, StyleSheet, View, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from 'react-navigation';

// Import database
import { database } from './database/Database';

// Import Screens
import FoldersScreen from './screens/FoldersScreen';
import NotesScreen from './screens/NotesScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import EditNoteScreen from './screens/EditNoteScreen';

const AppNavigator = createStackNavigator({
  FoldersScreen: { screen: FoldersScreen },
  NotesScreen: { screen: NotesScreen },
  AddNoteScreen: { screen: AddNoteScreen },
  EditNoteScreen: { screen: EditNoteScreen }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      databaseIsReady: false
    };
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    // hide splash screen
    SplashScreen.hide();

    // App is starting up
    this.appIsNowRunningInForeground();
    this.setState({
      appState: 'active'
    });

    // Listen for app state changes
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    // Remove app state change listener
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    // Once the database is ready, show the Lists
    if (this.state.databaseIsReady) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
    // Else, show nothing.
    return null;
  }

  // Handle the app going from foreground to background, and vice versa.
  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has moved from the background (or inactive) into the foreground
      this.appIsNowRunningInForeground();
    } else if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      this.appHasGoneToTheBackground();
    }
    this.setState({ appState: nextAppState });
  }

  // Code to run when app is brought to the foreground
  async appIsNowRunningInForeground() {
    console.log('App is now running in the foreground!');
    return database.open().then(() =>
      this.setState({
        databaseIsReady: true
      })
    );
  }

  // Code to run when app is sent to the background
  appHasGoneToTheBackground() {
    console.log('App has gone to the background.');
    database.close();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
