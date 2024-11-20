import logger from "./timerdef/loggerDefinition"
import { worker, workerType } from "./timerdef/workerFile"
import {
    EventlistenerType,
    ListenerArrayType,
    TimerArrayType,
    TimerType,
    UtilTimerType
} from "./timerdef/utilTimerType"

class Timer implements UtilTimerType {
    static instance: Timer;
    private worker: Worker
    private TimerArray: TimerArrayType
    private listenerArray: ListenerArrayType

    constructor() {
        this.TimerArray = []
        this.listenerArray = []
        this.worker = new Worker(URL.createObjectURL(new Blob([worker], { type: workerType })));

        (() => {
            this.worker.onerror = (error: any) => {
                
            };
            this.worker.onmessage = (event: any) => {
                if (event.data.type === TimerType.ERROR) {
                    this.dispatchEventListener(EventlistenerType.ERROR, event.data)
                }
                else if (event.data.type === TimerType.INVOKE) {
                    const callback = this.TimerArray.find((item) => item.id === event.data.id)
                    if (callback) {
                        callback.callback()
                    }
                }
                else if (event.data.type === TimerType.NOTFOUND) {
                    this.dispatchEventListener(EventlistenerType.ERROR, event.data)
                }
            };
        })()
    }

    addWorker(id: string, cb: (...args: any[]) => unknown, timer: number): void {
        if (!this.TimerArray.some((list) => list.id === id)) {
            this.TimerArray.push({
                id,
                callback: cb
            })
            this.worker.postMessage({
                type: TimerType.ADDINTERVAL,
                id,
                timer
            })
        }
        else {
            console.error(logger.DUPLICATE_ID)
        }
    }

    stopWorker(id: string): void {
        const index = this.TimerArray.findIndex((list) => list.id === id)
        if (index !== -1) {
            this.worker.postMessage({
                type: TimerType.STOPINTERVAL,
                id
            })
            this.TimerArray.splice(index, 1);
        }
        else {
            console.error(logger.NOTFOUND)
        }
    }
    addEventListener(key: string, listener: (response: any) => {}): void {
        if (!this.listenerArray.some((list) => list.key === key)) {
            this.listenerArray.push({
                key,
                callback: listener
            })
        }
        else {
            console.info(logger.SKIP_LISTENER);
        }
    }
    dispatchEventListener(key: string, data: any): void {
        const obs = this.listenerArray.find((item) => item.key === key)
        if (obs) {
            obs.callback(data)
        }
    }
    static getInstance(): Timer {
        if (!Timer.instance) {
            Timer.instance = new Timer();
        }
        return Timer.instance;
    }
}
export default Timer