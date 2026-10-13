/* A short headline made of sentences, each kept in one piece where it fits:
   "Thoughtfully Chosen. Beautifully Given." breaks between the sentences, not
   inside one, and a sentence too long for the screen wraps within itself. */
export default function Sentences({ text }) {
  return text.split(/(?<=[.!?])\s+/).map((sentence, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span style={{ display: 'inline-block' }}>{sentence}</span>
    </span>
  ))
}
