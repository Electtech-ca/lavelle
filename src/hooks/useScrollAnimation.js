import { useEffect, useRef, useState } from 'react'

export default function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', triggerOnce = true } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        el.classList.remove('scroll-hidden')
        el.classList.add('scroll-visible')
        if (triggerOnce) observer.unobserve(el)
      } else if (!triggerOnce) {
        setIsVisible(false)
        el.classList.remove('scroll-visible')
        el.classList.add('scroll-hidden')
      }
    }, { threshold, rootMargin })
    el.classList.add('scroll-hidden')
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}
