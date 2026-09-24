import { useState } from 'react'
import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { DIFFICULTY_LABEL, STATUSES, STATUS_LABEL } from '../model/constants'
import type { Quest, QuestStatus } from '../model/types'
import styles from './quest-card.module.css'

interface QuestCardProps {
  quest: Quest
  onStatusChange: (id: string, status: QuestStatus) => void
  onReset: (id: string) => void
  onRemove: (id: string) => void
}

export function QuestCard({ quest, onStatusChange, onReset, onRemove }: QuestCardProps) {
  console.log(`[render] QuestCard "${quest.title}"`)

  // Local (card-owned) state. It lives as long as React keeps this component
  // at the same place in the tree with the same key.
  const [doneSteps, setDoneSteps] = useState<boolean[]>(() => {
    // Initializers run only on mount, so this log shows when a card is created
    // from scratch (first render, new quest, or a key change on reset).
    console.log(`[mount] QuestCard "${quest.title}"`)
    return quest.steps.map(() => false)
  })
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState(false)

  const doneCount = doneSteps.filter(Boolean).length
  const total = quest.steps.length
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100)
  const allDone = total > 0 && doneCount === total
  const hasProgress = doneCount > 0 || notes.trim() !== ''
  const isCompleted = quest.status === 'completed'

  function toggleStep(index: number) {
    setDoneSteps((prev) => prev.map((done, i) => (i === index ? !done : done)))
  }

  return (
    <article className={styles.card} data-status={quest.status}>
      <header className={styles.top}>
        <Badge tone={quest.difficulty}>{DIFFICULTY_LABEL[quest.difficulty]}</Badge>
        <label className={styles.status}>
          <span className="visually-hidden">Status</span>
          <select
            value={quest.status}
            onChange={(e) => onStatusChange(quest.id, e.target.value as QuestStatus)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </label>
      </header>

      <h3 className={styles.title}>{quest.title}</h3>
      <p className={styles.meta}>
        {quest.region} · given by {quest.giver}
      </p>

      <div className={styles.reward}>
        <Badge tone="gold">{quest.reward.toLocaleString('en-US')} gold</Badge>
        {isCompleted && <span className={styles.claimed}>✓ Reward claimed</span>}
        {!expanded && notes.trim() !== '' && <span className={styles.noteFlag}>Has notes</span>}
      </div>

      <div className={styles.progress}>
        <div className={styles.progressLabel}>
          <span>Objectives</span>
          <span>
            {doneCount}/{total}
          </span>
        </div>
        <div
          className={styles.bar}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${quest.title} progress`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {allDone && !isCompleted && (
        <div className={styles.hint}>
          <span>All objectives done.</span>
          <Button size="sm" variant="primary" onClick={() => onStatusChange(quest.id, 'completed')}>
            Claim reward
          </Button>
        </div>
      )}

      {expanded && (
        <div className={styles.details}>
          <ul className={styles.steps}>
            {quest.steps.map((step, index) => (
              // Steps never reorder, so the index is a stable key here.
              <li key={index}>
                <label className={styles.step}>
                  <input
                    type="checkbox"
                    checked={doneSteps[index]}
                    onChange={() => toggleStep(index)}
                  />
                  <span>{step}</span>
                </label>
              </li>
            ))}
          </ul>

          <label className={styles.notes}>
            <span>Hero's notes</span>
            <textarea
              rows={2}
              value={notes}
              placeholder="Where did you leave off?"
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
      )}

      <footer className={styles.actions}>
        <Button size="sm" variant="ghost" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? 'Hide objectives' : 'Show objectives'}
        </Button>
        <span className={styles.spacer} />
        <Button
          size="sm"
          variant="ghost"
          disabled={!hasProgress}
          onClick={() => onReset(quest.id)}
          title="Clears checked objectives and notes"
        >
          Reset progress
        </Button>
        <Button size="sm" variant="danger" onClick={() => onRemove(quest.id)}>
          Abandon
        </Button>
      </footer>
    </article>
  )
}
