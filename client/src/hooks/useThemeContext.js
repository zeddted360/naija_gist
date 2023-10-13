import {useContext} from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useThemeContext = ()=>{

    const context = useContext(ThemeContext);

    if(!context){
        throw Error(' ThemeContext cannot be used outside the root App component');

    }
    
        return context;


}