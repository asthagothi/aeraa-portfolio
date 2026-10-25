// Sets the document title and the page-level theme (body background, so overscroll and the
// area behind the fixed nav match the page).
import { useEffect } from 'react'

export function useDocumentTheme(theme: 'wall' | 'studio' | 'journal', title: string) {
  useEffect(() => {
    document.title = title
    document.body.dataset.theme = theme
    return () => {
      delete document.body.dataset.theme
    }
  }, [theme, title])
}
