import useSWR from 'swr'
import Error from 'next/error'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { useAtom } from "jotai";
import { favouritesAtom } from "../store";
import { useState } from 'react';
import { useEffect } from 'react';
import { addToFavourites, removeFromFavourites } from '../lib/userData';

export default function ArtworkCardDetail(props) {
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);
    
    useEffect(()=>{
        setShowAdded(favouritesList?.includes(props.objectID))
    }, [favouritesList])

       
    async function favouritesClicked(e){
        if(showAdded){
            setFavouritesList(await removeFromFavourites(props.objectID));
            setShowAdded(false);
        } else {
            setFavouritesList(await addToFavourites(props.objectID));
            setShowAdded(true);
        }
    }

    if(error){
        return (<><Error statusCode={404}></Error></>)
    }
    else if(data == null || data == undefined){
        return null
    }
    else{
        return (
            <>
                <Card>
                    {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
                    <Card.Body>
                        <Card.Title>{data.title ? data.title : 'N/A'}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong> {data.objectDate ? data.objectDate : 'N/A'}<br />
                            <strong>Classification: </strong> {data.classification ? data.classification : 'N/A'}<br />
                            <strong>Medium: </strong> {data.medium ? data.medium : 'N/A'}<br /><br />

                            <strong>Artist: </strong> {data.artistDisplayName ? data.artistDisplayName: 'N/A'}
                            {data.artistDisplayName && 
                            (( <a href={data.artistWikidata_URL} style={{textDecoration: 'none'}} target="_blank" rel="noreferrer" >
                                <span> ( </span>
                                <u>wiki</u>
                                <span> )</span>
                            </a>))}                          
                            <br />
                            <strong>Credit Line: </strong> {data.creditLine ? data.creditLine : 'N/A'}<br />
                            <strong>Dimensions: </strong> {data.dimensions ? data.dimensions : 'N/A'}<br />
                            <br></br>
                        </Card.Text>
                            <Button variant={showAdded ? "primary" : "outline-primary"}  onClick={e => favouritesClicked(e)}>
                                {showAdded ?  "+ Favourite (added)" : "+ Favourite"}
                            </Button>
                    </Card.Body>
                </Card>
            </>
        )
    }
}