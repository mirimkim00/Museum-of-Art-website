import {useRouter} from 'next/router';
import {useState, useEffect} from 'react';
import {useAtom} from 'jotai';
import { favouritesAtom } from "../store";
import { searchHistoryAtom } from "../store";
import { getFavourites, getHistory } from "../lib/userData";
import { isAuthenticated } from "../lib/authenticate";

const PUBLIC_PATHS = ['/register', '/login', '/', '/_error'];

export default function RouteGuard(props){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    
    async function updateAtoms(){
        setFavouritesList(await getFavourites()); 
        setSearchHistory(await getHistory()); 
    }
    
    useEffect(() => {
        updateAtoms();
        authCheck(router.pathname);

        router.events.on('routeChangeComplete', authCheck);

        return () => {
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    function authCheck(url){
        const path = url.split('?')[0];
        if(!isAuthenticated() && !PUBLIC_PATHS.includes(path)){
            setAuthorized(false);
            router.push('/login');
        }else{
            setAuthorized(true);
        }
    }

    if(props.children == null || props.children == undefined){
        return null
    }
    else{
    return (
        <>
            {props.children}
        </>
    )}
}