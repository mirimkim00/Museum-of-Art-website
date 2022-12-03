import {useRouter} from 'next/router';
import useSWR from 'swr';
import { useState, useEffect} from 'react';
import Error from 'next/error';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '../../public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function Artwork() {
  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];
  
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  function previousPage() {
    page > 1 && setPage(prev => prev-1);
  }

  function nextPage() {
    page < artworkList.length && setPage(prev => prev+1);
  }

  useEffect(() => {
    if (data) {
      let results = [];
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
       }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);
 
  if(error){
    return (<><Error statusCode={404} /></>)
  }
  if(artworkList){
    return (
      <>
        <Row className="gy-4">
          {artworkList.length > 0 ?
            artworkList[page - 1].map(e => {
              return (
                <Col lg={3} key={e}><ArtworkCard objectID={e} /></Col>
              )
            }) :
            <Card>
              <Card.Body>
                <Card.Text>
                    <h4>Nothing Here</h4>
                    Try searching for something else.
                </Card.Text>
              </Card.Body>
            </Card>
          }
        </Row>
        {artworkList.length > 0 && 
        <Row>
          <Col><br />
              <Pagination>
                <Pagination.Prev onClick={previousPage}/>
                <Pagination.Item>{page}</Pagination.Item>
                <Pagination.Next onClick={nextPage}/>
              </Pagination>
          </Col>
        </Row>
        }
        {
          !artworkList && null 
        }
      </>
    )
  }
}