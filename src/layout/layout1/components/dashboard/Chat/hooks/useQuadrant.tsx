import React, { Ref, useEffect } from "react"

const useQuadrant = (ref: any, setQuadrant: (args: any) => void) => {
  useEffect(() => {
    const checkQuadrant = (event: MouseEvent) => {
      const div = ref.current

      if (div) {
        const rect = div.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const width = div.offsetWidth
        const height = div.offsetHeight

        const isLeft = mouseX < width / 2
        const isTop = mouseY < height / 2
        if (isTop && isLeft) {
          setQuadrant("Top-Left")
        } else if (isTop && !isLeft) {
          setQuadrant("Top-Right")
        } else if (!isTop && isLeft) {
          setQuadrant("Bottom-Left")
        } else {
          setQuadrant("Bottom-Right")
        }
      }
    }

    const div = ref.current
    if (div) {
      div.addEventListener("mousemove", checkQuadrant)
    }

    return () => {
      if (div) {
        div.removeEventListener("mousemove", checkQuadrant)
      }
    }
  }, [ref.current])

  return null
}

export default useQuadrant
