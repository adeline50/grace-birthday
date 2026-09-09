import { useEffect, useState } from 'react'

const LETTER = `To my dearest sister,

Somewhere between the little girl in these photos and the woman you are today, you became my favorite person in the whole world. This page can't hold every reason you matter, but it can hold the ones that matter most: your laugh, your gentle heart, your stubborn, beautiful hope.

As you turn another page in your story, know this — I am, and will always be, in your corner. Through everything.

Happy birthday, Grace. Shine as bright as you always do.

Forever your sister, with all my love`

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