import { createContext,useState,useEffect} from 'react';

export const ThemeContext = createContext();

export const ThemeContextProvider =({children})=> {

    const [darkTheme, setDarkTheme] = useState({ dark: false });
    localStorage.setItem('theme', JSON.stringify(darkTheme.dark));
    

    
    return(
        <ThemeContext.Provider value={{...darkTheme,setDarkTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}