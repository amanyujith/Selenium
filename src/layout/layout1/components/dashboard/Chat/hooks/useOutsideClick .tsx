import { useEffect, RefObject, useCallback } from "react"

function useOutsideClickAndEscape(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  optionalRef?: RefObject<HTMLElement | null>
) {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !optionalRef?.current?.contains(event.target as Node)
      ) {
        callback()
      }
    },
    [ref, callback]
  )

  const handleEscapeKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback()
      }
    },
    [callback]
  )

  useEffect(() => {
    const handleClickOutsideBound = handleClickOutside
    const handleEscapeKeyPressBound = handleEscapeKeyPress

    // Bind the event listeners when the component mounts
    document.addEventListener("mousedown", handleClickOutsideBound)
    document.addEventListener("keydown", handleEscapeKeyPressBound)

    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideBound)
      document.removeEventListener("keydown", handleEscapeKeyPressBound)
    }
  }, [handleClickOutside, handleEscapeKeyPress])
}

export default useOutsideClickAndEscape
