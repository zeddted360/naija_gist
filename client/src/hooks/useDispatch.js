import {useContext } from 'react';
import { DispatchContext} from '../context/dispatchContext';

export const useDispatch =()=>{
    const context = useContext(DispatchContext);
    if(!context){
        throw Error('DispatchContext cannot be used outsid the root app component')
    }
    return context;

}