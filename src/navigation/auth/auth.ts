
 const HdMeetAuthProvider = {
    isAuthenticated: false,
    signin(callback: VoidFunction) {
        HdMeetAuthProvider.isAuthenticated = true;
        setTimeout(callback, 100); // fake async
    },
    signout(callback: VoidFunction) {
        HdMeetAuthProvider.isAuthenticated = false;
        setTimeout(callback, 100);
    }
  };
  
  export { HdMeetAuthProvider };