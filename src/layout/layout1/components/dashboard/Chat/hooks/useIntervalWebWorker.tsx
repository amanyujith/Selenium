import { useEffect } from "react";
const  useIntervalWebWorker = (callback: (message: any) => void, interval: number) => {
    useEffect(() => {
      // Create a new worker
      const worker = new Worker(
        URL.createObjectURL(
          new Blob(
            [
              `
            self.addEventListener('message', function(e) {
              var interval = e.data;
  
              setInterval(function() {
                self.postMessage('Interval executed!');
              }, interval);
            });
          `,
            ],
            { type: 'application/javascript' }
          )
        )
      );
  
      // Start the worker and specify the interval
      worker.postMessage(interval);
  
      // Handle messages received from the worker
      worker.addEventListener('message', function(e) {
        callback(e.data); // Call the callback function with the message data
      });
  
      return () => {
        // Terminate the worker when the component is unmounted
        worker.terminate();
      };
    }, [callback, interval]);
  }
  

export default useIntervalWebWorker  