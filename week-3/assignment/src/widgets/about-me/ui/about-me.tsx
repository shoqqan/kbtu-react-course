import styles from './about-me.module.css'

const STACK = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Vite',
  'PostgreSQL',
  'REST API',
  'Git',
  'Docker',
  'Figma',
]

const FACTS = [
  { value: 'KBTU', label: 'Computer Science student' },
  { value: 'Full-stack', label: 'From UI components to the database' },
  { value: 'Almaty', label: 'Kazakhstan · GMT+5' },
]

export function AboutMe() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.head}>
        <span className={styles.kicker}>About me</span>
        <span className={styles.line} />
      </div>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.title}>
            I like software that feels light and behaves well.
          </h2>

          <p className={styles.text}>
            I am <strong>Shokan</strong>, a Computer Science student at KBTU and
            a full-stack developer. I started with the front end — React,
            TypeScript, a mild obsession with spacing and transitions — and kept
            going until the whole stack made sense: the API, the database, the
            deploy.
          </p>
          <p className={styles.text}>
            Most of what I know came from building things and breaking them:
            course projects, small web apps, and the assignments in this very
            repository. I care about readable code, honest interfaces, and
            finishing what I start.
          </p>
          <p className={styles.text}>
            Right now I am deepening my React knowledge and looking for an
            internship where I can ship real features with a real team.
          </p>

          <p className={styles.stackTitle}>Tools I reach for</p>
          <ul className={styles.stack}>
            {STACK.map((tech) => (
              <li key={tech} className={styles.chip}>
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.facts}>
          {FACTS.map((fact) => (
            <li key={fact.value} className={styles.fact}>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
