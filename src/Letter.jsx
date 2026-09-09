import { useEffect, useState } from 'react'

const LETTER = `Happy Birthday to an amazing sister! 🎂💐
May this new chapter of your life bring you more reasons to smile,
more beautiful memories to keep, and more dreams turning into reality.
You deserve happiness, peace, success and all the beautiful things life has to offer.
Keep shining, keep believing in yourself, and never forget how special you are.
I am grateful to have you as my sister, and I hope your birthday is as beautiful
and unforgettable as you are.

With lots of love, your sibling ❤️`

function useTypewriter(text, active, speed = 24) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    if (count >= text.length) return
    const id = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(id)
  }, [count, active, text, speed])
  return [text.slice(0, count), () => setCount(text.length)]
}

export default function Letter({ active, photo, photoCaption }) {
  const [text, skip] = useTypewriter(LETTER, active, 24)
  const done = text.length >= LETTER.length

  return (
    <section id="chapter-letter" className="letter-section">
      <h2 className="section-title">A letter, written just for you</h2>
      <p className="section-sub">Sealed with the things I never say out loud.</p>

      <div className="paper-wrap">
        <div className="paper">
          <span className="paper-pin" />
          <p className="paper-text">
            {text}
            {!done && <span className="caret" />}
          </p>
          {!done && (
            <button type="button" className="skip-btn" onClick={skip}>
              Show it all at once
            </button>
          )}
        </div>
        <figure className="polaroid pin-tape">
          <img src={photo} alt="" />
          <figcaption>{photoCaption}</figcaption>
        </figure>
      </div>
    </section>
  )
}