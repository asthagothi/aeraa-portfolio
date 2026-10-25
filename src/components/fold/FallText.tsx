// A heading whose letters fall into place, word by word, when it enters view (the parent carries
// data-drop="letters"; FoldHome's observer marks it in). Screen readers get the plain text once;
// the split letters are hidden from them. Words never break mid-word.
import type { CSSProperties } from 'react'
import styles from './FallText.module.css'

export default function FallText({ text }: { text: string }) {
  let i = 0
  const words = text.split(' ')
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className={styles.word}>
              {[...word].map((ch, c) => (
                <span key={c} className={styles.char} style={{ '--ci': i++ } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </>
  )
}
