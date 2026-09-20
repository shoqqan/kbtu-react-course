import { Icon } from '../icon'
import type { Theme } from '../../lib/use-theme.ts'
import styles from './theme-toggle.module.css'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className={styles.bulb}>
        <Icon name={isDark ? 'moon' : 'sun'} size={16} />
      </span>
      <span className={styles.label}>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}
