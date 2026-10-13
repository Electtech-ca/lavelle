import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/* Tabs that each have an address (/salon#colour, /spa#waxing …), so a link can
   open one. Arriving on a tab's address opens it and brings the tab bar up
   under the navbar; choosing a tab on the page only updates the address, so
   the page stays put. Without a known #hash the first tab shows.
   Returns the open tab's index, a function to choose one, and the ref for the
   tab bar. */
export default function useHashTab(ids) {
  const { hash, key, state } = useLocation()
  const navigate = useNavigate()
  const barRef = useRef(null)
  const indexOf = h => Math.max(0, ids.indexOf(h.replace('#', '')))
  const [tab, setTab] = useState(() => indexOf(window.location.hash))

  useEffect(() => {
    setTab(indexOf(hash))
    if (!ids.includes(hash.replace('#', '')) || state?.fromTab) return
    const id = setTimeout(() => {
      const bar = barRef.current
      if (bar) window.scrollTo({ top: bar.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(id)
  }, [hash, key])

  const choose = i => {
    setTab(i)
    navigate({ hash: ids[i] }, { replace: true, state: { fromTab: true } })
  }

  return [tab, choose, barRef]
}
