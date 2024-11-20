const formatWhiteboardData = (data: any) => {
    let covertData: any = {}
    if (Object.keys(data[0]).length) {
        data.forEach((val: any) => {
            covertData[val.id] = val
        })
        return covertData
    }
    else {
        return covertData
    }

}

export default formatWhiteboardData;
