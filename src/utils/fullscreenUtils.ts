const fullScreenState = (state: boolean) => {
    const screen = document.getElementById('MeetingSection') as any;
    
    if (state) {
        if (screen.requestFullscreen) {
            screen.parentNode.requestFullscreen();
        } else if (screen.webkitRequestFullscreen) { /* Safari */
            screen.parentNode.webkitRequestFullscreen();/* Safari */ 
        } else if (screen.msRequestFullscreen) { /* IE11 */
            screen.parentNode.msRequestFullscreen();
        }

    }
    else {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.fullscreenElement) { /* Safari */
            screen.parentNode.webkitExitFullscreen();
        } else if (document.fullscreenElement) { /* IE11 */
            screen.parentNode.msExitFullscreen();
            screen.parentNode.webkitExitFullscreen(); /* Safari */
            screen.parentNode.msExitFullscreen();/* IE11 */
        }  
    }
}

export default fullScreenState