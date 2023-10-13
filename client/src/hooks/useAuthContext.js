import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw Error('AuthContext cannot be used outside the root app component');
    }

    return context;
}