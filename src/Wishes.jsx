const WISHES = [
  'That your smile keeps turning ordinary days into magic.',
  'That every dream you whisper at night finds its way to your doorstep.',
  'That you always feel exactly as loved as you truly are.',
  'That this year hands you peace on hard days and joy on all the rest.',
  'That you never stop believing how extraordinary you are.',
  'That you are never more than one thought away from someone who adores you.',
]

export default function Wishes() {
  return (
    <section id="chapter-wishes" className="wishes-section">
      <h2 className="section-title">Wishes I have for you</h2>
      <p className="section-sub">Six small spells, cast with my whole heart.</p>
      <ul className="wishes-list">
        {WISHES.map((wish, i) => (
          <li key={i} className="wish-item" style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="heart-bullet" aria-hidden="true" />
            <span>{wish}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}