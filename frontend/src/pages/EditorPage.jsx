import MonacoCodeEditor from '../components/Editor';
import { useEffect } from 'react';
import { applyTheme, getCurrentTheme } from '../theme/themeConfig';

export default function EditorPage() {
  useEffect(() => {
    // Apply theme on mount
    applyTheme(getCurrentTheme());
  }, []);

  return <MonacoCodeEditor />;
}
