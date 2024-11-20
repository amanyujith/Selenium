class Logger {
   
    static log(msg: any, data?: any, options?: any) {
        consoleLogger('log', msg, data, options)
    }

    static warn(msg: any, data?: any, options?: any) {
        consoleLogger('warn', msg, data, options)
    }
    

    
}
export default Logger;


function consoleLogger(type: string, msg?: any, data?: any, options?: any) {
    if(process.env.REACT_APP_ENVIRONMENT === 'production'){
        return;
    }
    const timestamp = new Date().toISOString();
    if(typeof msg === 'object') {
        msg = JSON.stringify(msg);
    }
    let logMessage = `${timestamp}   - ${msg}`;

    if(typeof msg === 'object') {
        msg = JSON.stringify(msg);
    }
    if(data) {
        if(typeof data === 'object') {
            logMessage = logMessage + '###' +JSON.stringify(data);
        } else {
            logMessage = logMessage + '###' + data;
        }
    }
    if(options) {
        if(typeof options === 'object') {
            logMessage = logMessage + '###' +JSON.stringify(options);
        } else {
            logMessage = logMessage + '###' + options;
        }
    }
    switch(type) {
        case 'log': 
            console.log(logMessage);
            return;
        case 'warn':
            console.warn(logMessage);
            return;
        case 'error':
            console.error(logMessage);
            return;
         case 'info':
            console.info(logMessage);
            return;
        default:
            console.log(logMessage);
            return;

    }
    
}

