// import LoginConfig from "../containers/auth/login/login.config";
import HomeConfig from "../containers/home/homePage.config";

export const navigation = [
    {
        title: 'Home',
        path: "/",
        icon: 'home',
        transalate: 'HOME',
        permissions: [
            'public'
        ],
        config: HomeConfig,
    },
    {
        title: 'Login',
        path: "/auth/login",
        icon: 'lock',
        transalate: 'Login',
        permissions: [
            'public'
        ],
        // config: LoginConfig,
    },
    {
        title: 'Schedule',
        path: "/schedule",
        icon: 'schedule',
        transalate: 'SCHEDULE',
        permissions: [
            'private'
        ],
    }
];
