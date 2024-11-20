import { HoolvaUtils } from "../../utils";

class NotificationData {
    message: string
    type: string
    time: any
    id: any
    check: string
    constructor(data: any) {
        const userData: any = data ? data : {}
        this.message = userData.message || ""
        this.type = userData.type || "normal"
        this.time = userData.time || "default"
        this.id = HoolvaUtils.generatePassword();
        this.check = userData.check || ""
    }
}

export default NotificationData