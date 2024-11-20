import { HoolvaUtils } from "../../utils";

class ModalData {
    header: string;
    callback: any;
    message: any;
    // button: string;
    closeButton: boolean;
    buttons: any;
    type: string;
    argument: boolean;
    id: string;
    arg1: any;
    arg2: any;
    checkBox: any;
    category: string;
    constructor(data: any) {
        const userData: any = data ? data : {};
        this.message = userData.message || "";
        this.closeButton = userData.closeButton || false;
        this.buttons = userData.buttons || [];
        this.argument = userData.argument || false;
        this.type = userData.type || "";
        this.arg1 = userData.arg1 || "";
        this.arg2 = userData.arg2 || "";
        this.checkBox = userData.checkBox || null;
        this.id = HoolvaUtils.generatePassword();
        this.header = userData.header;
        this.category = userData.category || "";
    }
}

export default ModalData