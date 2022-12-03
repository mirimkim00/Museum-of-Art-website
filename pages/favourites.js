import { useAtom } from "jotai";
import { favouritesAtom } from "../store";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ArtworkCard from "../components/ArtworkCard";

export default function Favourites(){
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    if(!favouritesList) return null;
    
    return(
        <>
        <Row className="gy-4">
          {favouritesList.length > 0 ?
            favouritesList.map(e => {
              return (
                <Col lg={3} key={e}><ArtworkCard objectID={e} /></Col>
              )
            }) :
            <Card>
              <Card.Body>
                <Card.Text>
                    <h4>Nothing Here</h4>
                    Try adding some new artwork to the list.
                </Card.Text>
              </Card.Body>
            </Card>
          }
        </Row>
        </>
    )
}