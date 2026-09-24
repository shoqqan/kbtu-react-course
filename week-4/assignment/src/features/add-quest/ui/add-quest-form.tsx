import { useState, type FormEvent } from 'react'
import {
  DIFFICULTIES,
  DIFFICULTY_LABEL,
  REGIONS,
  type Difficulty,
  type NewQuest,
} from '@entities/quest'
import { Button } from '@shared/ui/button'
import styles from './add-quest-form.module.css'

interface AddQuestFormProps {
  onAdd: (quest: NewQuest) => void
}

const EMPTY_FORM = {
  title: '',
  region: REGIONS[0],
  giver: '',
  difficulty: 'normal' as Difficulty,
  reward: '100',
  steps: '',
}

export function AddQuestForm({ onAdd }: AddQuestFormProps) {
  console.log('[render] AddQuestForm')

  // Child-owned state: the parent doesn't care about half-typed input,
  // it only receives a finished quest through onAdd.
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  function update<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const title = form.title.trim()
    const steps = form.steps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    if (!title) {
      setError('Every quest needs a name.')
      return
    }
    if (steps.length === 0) {
      setError('Add at least one objective.')
      return
    }

    onAdd({
      title,
      region: form.region,
      giver: form.giver.trim() || 'Guild notice board',
      difficulty: form.difficulty,
      reward: Math.max(0, Number(form.reward) || 0),
      steps,
    })
    setForm(EMPTY_FORM)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Post a new quest</h2>

      <label className={styles.field}>
        <span>Quest name</span>
        <input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. The Drowned Bell"
          maxLength={60}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Region</span>
          <select value={form.region} onChange={(e) => update('region', e.target.value)}>
            {REGIONS.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Quest giver</span>
          <input
            value={form.giver}
            onChange={(e) => update('giver', e.target.value)}
            placeholder="Who asks?"
            maxLength={40}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Difficulty</span>
          <select
            value={form.difficulty}
            onChange={(e) => update('difficulty', e.target.value as Difficulty)}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Reward, gold</span>
          <input
            type="number"
            min={0}
            step={5}
            value={form.reward}
            onChange={(e) => update('reward', e.target.value)}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Objectives · one per line</span>
        <textarea
          rows={3}
          value={form.steps}
          onChange={(e) => update('steps', e.target.value)}
          placeholder={'Find the bell\nRing it at midnight'}
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary">
        Pin to the board
      </Button>
    </form>
  )
}
