export const formatTime = (timer: any) => {
    // const getSeconds = `0${(timer % 60)}`.slice(-2);
    // const minutes: any = `${Math.floor(timer / 60)}`
    // const getMinutes = `0${minutes % 60}`.slice(-2)
    // const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    const getSeconds = ("0" + ((timer / 10) % 100)).slice(-2);
    // const minutes: any = `${Math.floor(timer / 60)}`
    const getMinutes = ("0" + Math.floor((timer / 1000) % 60)).slice(-2);
    const getHours = ("0" + ((timer / 10) % 100)).slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`
}