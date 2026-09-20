import { Icon } from '@shared/ui/icon/icon.tsx'
import type { IconName } from '@shared/ui/icon/icon.tsx'
import styles from './contact.module.css'

type ContactItem = {
  icon: IconName
  label: string
  value: string
  href?: string
}

const CONTACTS: ContactItem[] = [
  {
    icon: 'github',
    label: 'GitHub',
    value: '@shoqqan',
    href: 'https://github.com/shoqqan',
  },
  { icon: 'pin', label: 'Based in', value: 'Almaty, Planet Earth' },
  { icon: 'spark', label: 'Status', value: 'Open to Senior positions' },
]

export function Contact() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.head}>
        <span className={styles.kicker}>Contacts</span>
        <span className={styles.line} />
      </div>

      <h2 className={styles.title}>Let&apos;s build something.</h2>
      <p className={styles.lead}>
        The fastest way to reach me is GitHub — issues, pull requests and
        collaboration invites are all welcome.
      </p>

      <ul className={styles.cards}>
        {CONTACTS.map((item) => {
          const content = (
            <>
              <span className={styles.iconBox}>
                <Icon name={item.icon} size={22} />
              </span>
              <span>
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={styles.cardValue}>{item.value}</span>
              </span>
            </>
          )

          return (
            <li key={item.label}>
              {item.href ? (
                <a
                  className={styles.card}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content}
                </a>
              ) : (
                <div className={styles.card}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>

      <p className={styles.note}>
        No phone number, no home address — just the internet and good coffee.
      </p>
    </section>
  )
}
