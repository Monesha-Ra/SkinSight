/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorBlack = '#fff';
const tintColorDark='#696F5E';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  black: {
    text: '#ECEDEE',
    background: '#262526',
    tint: tintColorBlack,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorBlack,
  },
  dark: {
    text: '#696F5E',
    background: '#696F5E',
    tint: tintColorDark,
    icon: '#696F5E',
    tabIconDefault: '#696F5E',
    tabIconSelected: tintColorDark,
  },
};
