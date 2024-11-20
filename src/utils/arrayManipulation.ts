class arrayManipulationUtil {
    static compare(a: any, b: any, type: any, initital: any): any {
        if ((a.host || a.isPublisher) && initital) {
            if (a.isPublisher) {
                return -1
            }
            else {
                if (b.isPublisher) {
                    return 1
                }
                else if (b.host) {
                    return arrayManipulationUtil.compare(a, b, "alphabets", false)
                }
                else {
                    return -1
                }
            }
        }
        else if (type === "alphabets") {
            if ((b.host || b.isPublisher) && initital) {
                return 1;
            } else {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
        else if (type === "numbers") {
            return a.timestamp - b.timestamp
        }
        else if (type === "audio" || type === "video") {
            if (a[type] === b[type]) {
                return 0
            } else if (a) {
                return -1
            }
            else
                return 1
        }
    }
    static sort(array: any[], from: number, to: number) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }
}
export default arrayManipulationUtil