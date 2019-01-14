import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// Import Components
import FolderComponent from './Folder/Folder';
import NoteComponent from './Note/Note';
import AddNoteComponent from './AddNote/AddNote';
import EditNoteComponent from './EditNote/EditNote';
import SettingsComponent from './Settings/Settings';

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Transition screen from bottom
  if (
    (prevScene && prevScene.route.routeName === 'FolderComponent' && nextScene.route.routeName === 'SettingsComponent')
    || (prevScene && prevScene.route.routeName === 'NoteComponent' && nextScene.route.routeName === 'AddNoteComponent')
  ) {
    return {
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true,
      },
      screenInterpolator: ({ layout, position, scene }) => {
        const { index } = scene;
        const { initHeight } = layout;

        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [+initHeight, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    };
  }
  return null;
};

const AppNavigator = createStackNavigator(
  {
    FolderComponent: { screen: FolderComponent },
    NoteComponent: { screen: NoteComponent },
    AddNoteComponent: { screen: AddNoteComponent },
    EditNoteComponent: { screen: EditNoteComponent },
    SettingsComponent: { screen: SettingsComponent },
  },
  {
    transitionConfig: nav => handleCustomTransition(nav),
  },
);

export default AppNavigator;
