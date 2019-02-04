// import React from 'react';
// import PropTypes from 'prop-types';
// import {
//   View, TextInput, ScrollView, Keyboard, Dimensions, TouchableOpacity, Text, Share, Image,
// } from 'react-native';
// import { NavigationActions } from 'react-navigation';

// // Import Database
// import { database } from '../../database/Database';

// // Import Styles
// import themeStyle from '../shared/styles/colorStyle';
// import defaultHeaderStyle from '../shared/styles/defaultHeaderStyle';

// // Import Icons
// const backIcon = require('../../assets/images/back.png');
// const shareIcon = require('../../assets/images/share.png');

// // Declare for using func inside navigationOptions
// let addNoteThis;

// export default class AddNoteComponent extends React.Component {
//   // Header Component
//   static navigationOptions = ({ navigation }) => {
//     const { params = {} } = navigation.state;

//     return {
//       headerStyle: [
//         defaultHeaderStyle.header,
//         params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
//       ],
//       headerTintColor: '#18C4E6',
//       headerRight: params.action,
//       headerLeft: (
//         <TouchableOpacity
//           style={style.addNoteHeaderBackButton}
//           onPress={() => {
//             navigation.dispatch(NavigationActions.back());
//             addNoteThis.handleAddNote();
//           }}
//         >
//           <Image source={backIcon} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
//           <Text style={style.addNoteHeaderBackButtonText}>{params.parentFolder.title.length <= 15 ? params.parentFolder.title : 'Back'}</Text>
//         </TouchableOpacity>
//       ),
//     };
//   };

//   constructor(props) {
//     super(props);
//     const { navigation } = this.props;

//     this.state = {
//       parentFolder: navigation.getParam('parentFolder', 'empty-folder'),
//       colorMode: navigation.getParam('colorMode', 'no-mode'),
//       text: '',
//       visibleHeight: 230,
//     };

//     this.keyboardWillShow = this.keyboardWillShow.bind(this);
//     this.keyboardWillHide = this.keyboardWillHide.bind(this);
//   }

//   componentWillMount() {
//     this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
//     this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
//   }

//   componentDidMount() {
//     addNoteThis = this;
//   }

//   componentWillUnmount() {
//     this.keyboardWillShowListener.remove();
//     this.keyboardWillHideListener.remove();
//   }

//   keyboardWillShow(e) {
//     const { navigation } = this.props;

//     navigation.setParams({
//       action: (
//         <TouchableOpacity
//           onPress={() => {
//             Keyboard.dismiss();
//           }}
//           style={style.actionButtons}
//         >
//           <Text style={style.doneButtonText}>Done</Text>
//         </TouchableOpacity>
//       ),
//     });
//     this.setState({
//       visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 100,
//     });
//   }

//   keyboardWillHide() {
//     const { text } = this.state;
//     const { navigation } = this.props;

//     let shareButtonColor = '#18C4E6';
//     if (!text) {
//       shareButtonColor = '#ccc';
//     }

//     navigation.setParams({
//       action: (
//         <TouchableOpacity
//           disabled={!text}
//           onPress={() => Share.share({
//             message: text,
//           })
//           }
//           style={style.actionButtons}
//         >
//           <Image style={[style.shareButtonText, { tintColor: shareButtonColor }]} source={shareIcon} />
//         </TouchableOpacity>
//       ),
//     });
//     this.setState({
//       visibleHeight: Dimensions.get('window').height - 100,
//     });
//   }

//   // Save note func
//   handleAddNote() {
//     const { text, parentFolder } = this.state;
//     const { navigation } = this.props;

//     if (text === null || text === '') {
//       console.log('Empty note');
//     } else {
//       database.createNote(text, parentFolder).then(() => navigation.state.params.refreshNoteList());
//     }
//   }

//   render() {
//     const { visibleHeight, colorMode } = this.state;

//     return (
//       <View style={[style.addNoteContainer, colorMode ? themeStyle.backgroundDark : themeStyle.backgroundWhite]}>
//         <ScrollView keyboardDismissMode="on-drag">
//           <TextInput
//             onChangeText={text => this.setState({ text })}
//             style={{
//               height: visibleHeight - 20,
//               paddingRight: 15,
//               fontSize: 18,
//               color: colorMode ? '#ffffff' : '#4A4A4A',
//             }}
//             textAlignVertical="top"
//             multiline
//             autoFocus
//           />
//         </ScrollView>
//       </View>
//     );
//   }
// }

// AddNoteComponent.propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func.isRequired,
//   }).isRequired,
// };

import React from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import {
  Image, View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Text, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import CNRichTextEditor, { CNToolbar, getInitialObject, getDefaultStyles } from 'react-native-cn-richtext-editor';

import {
  Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, renderers,
} from 'react-native-popup-menu';
import style from './style';

// // Import Database
import { database } from '../../database/Database';

// // Import Styles
import themeStyle from '../shared/styles/colorStyle';
import defaultHeaderStyle from '../shared/styles/defaultHeaderStyle';

// // Declare for using func inside navigationOptions
let addNoteThis;

// Import Icons
const boldIcon = require('../../assets/images/rich/bold.png');
// const imageIcon = require('../../assets/images/rich/picture.png');
const olIcon = require('../../assets/images/rich/ol.png');
const ulIcon = require('../../assets/images/rich/ul.png');
const strikethroughIcon = require('../../assets/images/rich/strikethrough.png');
const italicIcon = require('../../assets/images/rich/italic.png');
const underlineIcon = require('../../assets/images/rich/underline.png');
const backIcon = require('../../assets/images/back.png');
const shareIcon = require('../../assets/images/share.png');

// const { SlideInMenu } = renderers;

// const { width } = Dimensions.get('window');
const defaultStyles = getDefaultStyles();

export default class AddNoteComponent extends React.Component {
  //   // Header Component
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerStyle: [
        defaultHeaderStyle.header,
        params.colorMode ? [themeStyle.backgroundSoftDark, themeStyle.darkBorder] : [themeStyle.backgroundWhite, themeStyle.lightBorder],
      ],
      headerTintColor: '#18C4E6',
      headerRight: params.action,
      headerLeft: (
        <TouchableOpacity
          style={style.addNoteHeaderBackButton}
          onPress={() => {
            navigation.dispatch(NavigationActions.back());
            addNoteThis.handleAddNote();
          }}
        >
          <Image source={backIcon} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
          <Text style={style.addNoteHeaderBackButtonText}>{params.parentFolder.title.length <= 15 ? params.parentFolder.title : 'Back'}</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.state = {
      parentFolder: navigation.getParam('parentFolder', 'empty-folder'),
      // colorMode: navigation.getParam('colorMode', 'no-mode'),
      selectedTag: 'body',
      // selectedColor: 'default',
      // selectedHighlight: 'default',
      // colors: ['red', 'green', 'blue'],
      // highlights: ['yellow_hl', 'pink_hl', 'orange_hl', 'green_hl', 'purple_hl', 'blue_hl'],
      selectedStyles: [],
      value: [getInitialObject],
    };

    this.state.value = [getInitialObject()];
    this.editor = null;
  }

  componentDidMount() {
    addNoteThis = this;
  }

  onStyleKeyPress = (toolType) => {
    if (toolType !== 'image') {
      this.editor.applyToolbar(toolType);
    }
  };

  onSelectedTagChanged = (tag) => {
    this.setState({
      selectedTag: tag,
    });
  };

  onSelectedStyleChanged = (styles) => {
    // const { colors, highlights } = this.state;
    // const sel = styles.filter(x => colors.indexOf(x) >= 0);

    // const hl = styles.filter(x => highlights.indexOf(x) >= 0);
    this.setState({
      selectedStyles: styles,
      // selectedColor: sel.length > 0 ? sel[sel.length - 1] : 'default',
      // selectedHighlight: hl.length > 0 ? hl[hl.length - 1] : 'default',
    });
  };

  onValueChanged = (value) => {
    this.setState({
      value,
    });
  };

  // insertImage(url) {
  //   this.editor.insertImage(url);
  // }

  // askPermissionsAsync = async () => {
  //   const camera = await Permissions.askAsync(Permissions.CAMERA);
  //   const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  //   this.setState({
  //     hasCameraPermission: camera.status === 'granted',
  //     hasCameraRollPermission: cameraRoll.status === 'granted',
  //   });
  // };

  // useLibraryHandler = async () => {
  //   await this.askPermissionsAsync();
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 4],
  //     base64: false,
  //   });

  //   this.insertImage(result.uri);
  // };

  // useCameraHandler = async () => {
  //   await this.askPermissionsAsync();
  //   const result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [4, 4],
  //     base64: false,
  //   });
  //   console.log(result);

  //   this.insertImage(result.uri);
  // };

  // onImageSelectorClicked = (value) => {
  //   if (value === 1) {
  //     this.useCameraHandler();
  //   } else if (value === 2) {
  //     this.useLibraryHandler();
  //   }
  // };

  // onColorSelectorClicked = (value) => {
  //   const { selectedColor } = this.state;

  //   if (value === 'default') {
  //     this.editor.applyToolbar(selectedColor);
  //   } else {
  //     this.editor.applyToolbar(value);
  //   }

  //   this.setState({
  //     selectedColor: value,
  //   });
  // };

  // onHighlightSelectorClicked = (value) => {
  //   const { selectedHighlight } = this.state;

  //   if (value === 'default') {
  //     this.editor.applyToolbar(selectedHighlight);
  //   } else {
  //     this.editor.applyToolbar(value);
  //   }

  //   this.setState({
  //     selectedHighlight: value,
  //   });
  // };

  // Save note func
  handleAddNote() {
    const { value, parentFolder } = this.state;
    const { navigation } = this.props;

    console.log(value);
    // if (text === null || text === '') {
    //   console.log('Empty note');
    // } else {
    database.createNote(value, parentFolder).then(() => navigation.state.params.refreshNoteList());
    // }
  }

  // renderImageSelector() {
  //   return (
  //     <Menu renderer={SlideInMenu} onSelect={this.onImageSelectorClicked}>
  //       <MenuTrigger>
  //         <Image source={imageIcon} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
  //       </MenuTrigger>
  //       <MenuOptions optionsContainerStyle={style.imageOptionsContainerStyle}>
  //         <MenuOption style={style.imageMenuOptionStyle} value={1}>
  //           <Text style={style.imageMenuOptionText}>Take Photo</Text>
  //         </MenuOption>
  //         <MenuOption style={style.imageMenuOptionStyle} value={2}>
  //           <Text style={style.imageMenuOptionText}>Photo Library</Text>
  //         </MenuOption>
  //         <MenuOption style={style.imageMenuOptionStyle} value={3}>
  //           <Text style={style.imageMenuOptionText}>Cancel</Text>
  //         </MenuOption>
  //       </MenuOptions>
  //     </Menu>
  //   );
  // }

  // renderColorMenuOptions = () => {
  //   const { selectedColor, colors } = this.state;
  //   let lst = [];

  //   if (defaultStyles[selectedColor]) {
  //     lst = colors.filter(x => x !== selectedColor);
  //     lst.push('default');
  //     lst.push(selectedColor);
  //   } else {
  //     lst = colors.filter(x => true);
  //     lst.push('default');
  //   }

  //   return lst.map((item) => {
  //     const color = defaultStyles[item] ? defaultStyles[item].color : 'black';
  //     return (
  //       <MenuOption value={item} key={item}>
  //         <Image source={boldIcon} fadeDuration={0} color={color} style={style.addNoteHeaderBackButtonImage} />
  //         {/* <MaterialCommunityIcons name="format-color-text" color={color} size={28} /> */}
  //       </MenuOption>
  //     );
  //   });
  // };

  // renderHighlightMenuOptions = () => {
  //   const { selectedHighlight, highlights } = this.state;
  //   let lst = [];

  //   if (defaultStyles[selectedHighlight]) {
  //     lst = highlights.filter(x => x !== selectedHighlight);
  //     lst.push('default');
  //     lst.push(selectedHighlight);
  //   } else {
  //     lst = highlights.filter(x => true);
  //     lst.push('default');
  //   }

  //   return lst.map((item) => {
  //     const bgColor = defaultStyles[item] ? defaultStyles[item].backgroundColor : 'black';
  //     return (
  //       <MenuOption value={item} key={item}>
  //         <Image source={boldIcon} fadeDuration={0} color={bgColor} style={style.addNoteHeaderBackButtonImage} />
  //         {/* <MaterialCommunityIcons name="marker" color={bgColor} size={26} /> */}
  //       </MenuOption>
  //     );
  //   });
  // };

  // renderColorSelector() {
  // const { selectedColor } = this.state;
  // let selectedColor = '#737373';
  // if (defaultStyles[this.state.selectedColor]) {
  //   selectedColor = defaultStyles[this.state.selectedColor].color;
  // }

  //   return (
  //     <Menu renderer={SlideInMenu} onSelect={this.onColorSelectorClicked}>
  //       <MenuTrigger>
  //         <Image source={boldIcon} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
  //       </MenuTrigger>
  //       <MenuOptions customStyles={optionsStyles}>{this.renderColorMenuOptions()}</MenuOptions>
  //     </Menu>
  //   );
  // }

  // renderHighlight() {
  // const { selectedHighlight } = this.state;
  // let selectedColor = '#737373';
  // if (defaultStyles[selectedHighlight]) {
  //   selectedColor = defaultStyles[selectedHighlight].backgroundColor;
  // }

  //   return (
  //     <Menu renderer={SlideInMenu} onSelect={this.onHighlightSelectorClicked}>
  //       <MenuTrigger>
  //         <Image source={boldIcon} fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />
  //       </MenuTrigger>
  //       <MenuOptions customStyles={highlightOptionsStyles}>{this.renderHighlightMenuOptions()}</MenuOptions>
  //     </Menu>
  //   );
  // }

  render() {
    const { value, selectedTag, selectedStyles } = this.state;

    return (
      <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={0} style={style.addNoteView}>
        <MenuProvider style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={style.addNoteContainer}>
              <CNRichTextEditor
                ref={input => (this.editor = input)}
                onSelectedTagChanged={this.onSelectedTagChanged}
                onSelectedStyleChanged={this.onSelectedStyleChanged}
                value={value}
                style={style.addNoteEditor}
                styleList={defaultStyles}
                onValueChanged={this.onValueChanged}
              />
            </View>
          </TouchableWithoutFeedback>

          <View
            style={{
              minHeight: 35,
              paddingBottom: 20,
            }}
          >
            <CNToolbar
              size={32}
              bold={<Image source={boldIcon} name="format-bold" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              italic={<Image source={italicIcon} name="format-italic" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              underline={<Image source={underlineIcon} name="format-underline" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              lineThrough={<Image source={strikethroughIcon} name="format-lineThrough" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              body={<Image source={boldIcon} name="format-body" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              title={<Image source={boldIcon} name="format-title" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              heading={<Image source={boldIcon} name="format-heading" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              ul={<Image source={ulIcon} name="format-ul" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              ol={<Image source={olIcon} name="format-ol" fadeDuration={0} style={style.addNoteHeaderBackButtonImage} />}
              // image={this.renderImageSelector()}
              // foreColor={this.renderColorSelector()}
              // highlight={this.renderHighlight()}
              selectedTag={selectedTag}
              selectedStyles={selectedStyles}
              onStyleKeyPress={this.onStyleKeyPress}
            />
          </View>
        </MenuProvider>
      </KeyboardAvoidingView>
    );
  }
}

AddNoteComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

// const optionsStyles = {
//   optionsContainer: {
//     backgroundColor: 'yellow',
//     padding: 0,
//     width: 40,
//     marginLeft: width - 40 - 30,
//     alignItems: 'flex-end',
//   },
//   optionsWrapper: {
//     backgroundColor: 'white',
//   },
//   optionWrapper: {
//     margin: 2,
//   },
//   optionTouchable: {
//     underlayColor: 'gold',
//     activeOpacity: 70,
//   },
// };

// const highlightOptionsStyles = {
//   optionsContainer: {
//     backgroundColor: 'transparent',
//     padding: 0,
//     width: 40,
//     marginLeft: width - 40,

//     alignItems: 'flex-end',
//   },
//   optionsWrapper: {
//     backgroundColor: 'white',
//   },
//   optionWrapper: {
//     margin: 2,
//   },
//   optionTouchable: {
//     underlayColor: 'gold',
//     activeOpacity: 70,
//   },
// };
