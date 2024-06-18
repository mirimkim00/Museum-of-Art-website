import { Card, Form, Alert, Button } from "react-bootstrap";
import { useState } from 'react';
import { authenticateUser } from '../lib/authenticate';
import { useRouter } from 'next/router';
import { getToken } from "../lib/authenticate";
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import { searchHistoryAtom } from "../store";
import { getFavourites, getHistory } from "../lib/userData";

export default function Login(props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState('');
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistoryList, setSearchHistory] = useAtom(searchHistoryAtom);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      await updateAtoms();
      router.push('/favourites');
    } catch (err) {
      // console.log('handle error')
      setWarning(err.message);
    }
  }

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  return (
    <>
      <Card bg="light">
        <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
      </Card>
      <br />
      {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label><Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label><Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button>
      </Form>
    </>
  );
}