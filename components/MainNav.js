import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useRouter} from 'next/router';
import {useState} from 'react';
import { useAtom } from "jotai";
import { useForm } from 'react-hook-form';
import { searchHistoryAtom } from "../store";
import { addToHistory } from "../lib/userData";
import { readToken, removeToken } from "../lib/authenticate";

export default function MainNav() {
   const router = useRouter();
   const [route, setRoute] = useState();
   const [isExpanded, setIsExpanded] = useState(false);
   const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
   const [ searchField, setSearchField ] = useState('');
   let token = readToken();
   const { handleSubmit } = useForm({
        defaultValues: {
            searchField: ''
        }
    })

   async function submitForm(e) {
       let queryString = "";
       queryString = `title=true&q=${searchField}`;
       setIsExpanded(false);
       setSearchHistory(await addToHistory(`title=true&q=${searchField}`))
       setSearchField('');
       router.push(`/artwork?${queryString}`);
   }

   function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
   } 
 
    return (
     <>
        <Navbar expanded={isExpanded} bg="light" expand="lg" className="fixed-top navbar-dark bg-dark">
            <Container>
            <Navbar.Brand>Mirim Kim</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => {setIsExpanded(!isExpanded)}}/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link href="/" passHref legacyBehavior>
                        <Nav.Link onClick={() => {setIsExpanded(false)}} active={router.pathname === "/"}>Home</Nav.Link>
                    </Link>
                    {token && <Link href="/search" passHref legacyBehavior>
                        <Nav.Link onClick={() => {setIsExpanded(false)}} active={router.pathname === "/search"}>Advanced Search</Nav.Link>
                    </Link>}
                </Nav>
                &nbsp;
                {token && <Form className="d-flex" onSubmit={handleSubmit(submitForm)}>
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    />
                    <Button type="submit" variant="btn btn-success">Search</Button>
                </Form>}
                &nbsp;
                {token && <Nav>
                    <NavDropdown title= {token.userName} id="basic-nav-dropdown">
                        <Link href="/favourites" passHref legacyBehavior>
                            <NavDropdown.Item active={router.pathname === "/favourites"} onClick={() => setIsExpanded(false)}>Favourites</NavDropdown.Item>
                        </Link>
                        <Link href="/history" passHref legacyBehavior>
                            <NavDropdown.Item active={router.pathname === "/history"} onClick={() => setIsExpanded(false)}>Search History</NavDropdown.Item>
                        </Link>
                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>}
                { !token && <Nav>
                  <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={(e) => setIsExpanded(false)}>Register</Nav.Link></Link>
                  <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={(e) => setIsExpanded(false)}>Login</Nav.Link></Link>
                
                </Nav>}
            </Navbar.Collapse>
            </Container>
        </Navbar>
        <br /><br />
     </>
    )
  }