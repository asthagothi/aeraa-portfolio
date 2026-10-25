// The Wheel backdrop: two 3D drums of questions either side of the device, like a phone's picker
// wheel. FoldHome turns them with scroll (`turnWheel` in wheel.ts); the question facing the viewer is
// lit and clickable, and opens an email with the question as its subject. Each drum holds its questions twice
// (8 slots, 45° apart) so the wheel never shows a gap; the repeats are hidden from assistive tech.
import { call, wheelQuestions } from '../../content/home.ts'
import styles from './QuestionWheel.module.css'
import { STEP } from './wheel.ts'

function Drum({ side, questions }: { side: 'left' | 'right'; questions: readonly string[] }) {
  const slots = [...questions, ...questions]
  return (
    <div className={styles.drum} data-side={side}>
      <ul role="list" className={styles.inner} data-drum>
        {slots.map((q, i) => {
          const repeat = i >= questions.length
          return (
            <li key={i} className={styles.slot} style={{ ['--a' as string]: `${i * STEP}deg` }} data-angle={i * STEP} aria-hidden={repeat || undefined}>
              <a className={styles.question} href={`mailto:${call.email}?subject=${encodeURIComponent(q)}`} tabIndex={repeat ? -1 : undefined}>
                {q}
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function QuestionWheel({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.wheel} ${className}`} data-wheel aria-label="Questions you could ask me">
      <Drum side="left" questions={wheelQuestions.left} />
      <Drum side="right" questions={wheelQuestions.right} />
    </div>
  )
}
