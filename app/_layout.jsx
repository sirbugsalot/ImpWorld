// Any new file you create anywhere in your project:
import { useTheme } from 'src/context/ThemeContext'; // Always the same source

const MyNewPage = () => {
  const { colors } = useTheme(); // Automatically works!
  return <View style={{ backgroundColor: colors.background }} />;
}

// This approach creates a "Theme Engine" that powers your entire app automatically, rather than a manual checklist of pages.
  
