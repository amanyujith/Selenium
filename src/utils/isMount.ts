import { useRef, useEffect } from "react"

export function useIsMounted(): { current: boolean } {
    const componentIsMounted = useRef(true)
    useEffect(() => () => { componentIsMounted.current = false }, [])
    return componentIsMounted
}