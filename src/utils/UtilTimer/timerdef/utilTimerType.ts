
type delegater = (...args: any[]) => unknown
type ListenerType = (response: any) => {}

type TimerArrayType = Array<{ callback: delegater, id: string }>
type ListenerArrayType = Array<{ key: string, callback: ListenerType }>

interface UtilTimerType {
    addWorker(id: string, cb: (...args: any[]) => unknown, timer: number): void
    stopWorker(id: string): void
    addEventListener(key: string, listener: (response: any) => {}): void
    dispatchEventListener(key: string, data: any): void
}

enum TimerType {
    ADDINTERVAL = "addInterval",
    STOPINTERVAL = "stopInterval",
    NOTFOUND = "not_found",
    INVOKE = "invoke",
    ERROR = "error"
}
enum EventlistenerType {
    ERROR = "error"
}
export {
    EventlistenerType,
    TimerType,
}
export type{
    UtilTimerType,
    TimerArrayType,
    ListenerArrayType,
    delegater,
    ListenerType
}

