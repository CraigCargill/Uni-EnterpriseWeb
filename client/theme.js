//Relevant imports
import { createMuiTheme } from "@material-ui/core/styles";

//Creates a project wide colour bank of the standard colours that will be used
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: "#171a1d",
      main: "#171a1d",
      dark: "#171a1d",
      contrastText: "#fff",
    },
    secondary: {
      light: "#E50914",
      main: "#E50914",
      dark: "#E50914",
      contrastText: "#000",
    },
    modes: {
      lightMode: "#fff",
      darkMode: "#3D4849",
    },
    openTitle: "#84050c",
    protectedTitle: "#E50914",
    type: "light",
  },
});
export default theme;
