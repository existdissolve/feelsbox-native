import {configureFonts, DefaultTheme} from "react-native-paper";

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(customFonts),
    roundness: 30,
    colors: {
        ...DefaultTheme.colors,
        primary: "#4169E1",
        accent: "#f1c40f",
    }
};

export default theme;
