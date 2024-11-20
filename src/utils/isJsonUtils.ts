const isJson = (response: any) => {
    let data: any = null;
    try {
        data = JSON.parse(response);
    } catch (e) {
        return false;
    }
    return data;
}

export default isJson;