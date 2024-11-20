import React from 'react'

import { Store } from 'react-notifications-component';
const Notification = (title: string, message: string, type: 'success' | 'danger' | 'info' | 'default' | 'warning') => {
    Store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            // onScreen: true
            showIcon : true,
        }
    });
}
export default Notification;