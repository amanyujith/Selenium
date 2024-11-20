const worker = ` (() => {
    const intervalArray = []
    self.onmessage = (event) => {
      if (event.data.type === "addInterval") {
        const isDuplicate = intervalArray.some((elem) => elem.id === event.data.id)
        if (!event.data.id || !event.data.timer || isDuplicate) {
          self.postMessage({
            type: "error",
            id:event.data.id,
            reason: !event.data.id ? "id_is_missing"
              : !event.data.timer ? "timer_missing"
                : isDuplicate ? "duplicate_id_found" : ""
          })
        }
        else {
          const timerObject = {
            id: event.data.id,
            interval: +event.data.timer,
            intervalRef: null 
          }
          timerObject.intervalRef = setInterval(() => {
            self.postMessage({
              type: "invoke",
              id: event.data.id
            })
          }, timerObject.interval)
          intervalArray.push(timerObject)
        }
      }
      else if (event.data.type === "stopInterval") {
        const index = intervalArray.findIndex((list) => list.id === event.data.id)
        if (index != -1) {
          const elem = intervalArray[index]
          if (elem.intervalRef) {
            clearInterval(elem.intervalRef)
            intervalArray.splice(index, 1);
          }
        }
        else {
          self.postMessage({
            type: "not_found",
            id:event.data.id,
            reason: "unmatched_id"
          })
        }
      }
    }
  })()`

const workerType = "text/javascript"

export {
  worker,
  workerType
}