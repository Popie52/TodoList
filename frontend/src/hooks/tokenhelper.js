import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'

const useTokenExpiryLogout = (token, logout) => {
    useEffect(()=> {
        if(!token) return;
        let isActive = true;
        try {
            const {exp } = jwtDecode(token);
            const expiryTime = exp*1000;
            const now = Date.now();
            const timeout = expiryTime - now - 60 *1000;
            if(timeout <= 0) {
                logout();
                return;
            }
            const timerId = setTimeout(()=> {
                if(isActive) logout();
            }, timeout);
            return () => {
                isActive = false;
                clearTimeout(timerId);
            }
        } catch(e) {
            logout();
        }
    }, [logout, token])
}

export default useTokenExpiryLogout