import React, { useEffect, useContext } from 'react';
import Context from '../../globalState/context'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

const NavBar = (props) => {
    const { state, dispatch } = useContext(Context);
    useEffect(() => {

    }, [])

    const handleSignOut = () => {
        dispatch({ type: "LOGOUT_USER" })
    }
    return (
        <>
            {!state.id_user && <Redirect to="/login" />}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to="/" className="navbar-brand">Unicarm Comenzi</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        {state.nume_utilizator === "admin" ? (
                            <li className="nav-item dropdown">
                                <Link to="/" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Administrare
                                </Link>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link to="/VerificareComenzi" className="dropdown-item">Verificare Comenzi</Link>
                                    <Link to="/AdaugaArticole" className="dropdown-item">Adaugare Articole</Link>
                                    <Link to="/StergeArticole" className="dropdown-item">Dezactiveaza Aricole</Link>
                                    <Link to="/AdaugaMagazinNou" className="dropdown-item">Adauga Magazin Nou</Link>
                                    <Link to="/Receptie" className="dropdown-item">Adauga Stoc / Receptie</Link>
                                    <Link to="/ModificaPreturi" className="dropdown-item">Modifica Preturi Articole</Link>
                                    <Link to="/VerificaStocActual" className="dropdown-item">Verifica Stoc / Pret Actual</Link>
                                    <Link to="/Inventar" className="dropdown-item">Inventar</Link>
                                </div>
                            </li>) : null}
                        {state.nume_utilizator === "admin" ? (
                            <li className="nav-item dropdown">
                                <Link to="/" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Rapoarte
                                </Link>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link to="/RaportComenziData" className="dropdown-item">Raport Comenzi - Dupa Data / Magazine</Link>
                                    <Link to="/RaportComenziPerMagazine" className="dropdown-item">Raport Comenzi per Magazine</Link>
                                </div>
                            </li>) : null}
                        {state.nume_utilizator !== "admin" ? (
                            <li className="nav-item">
                                {/* <Link to="/CreareComanda" className="btn btn-primary" >Creare Comanda</Link> */}
                            </li>
                        ) : null}
                    </ul>
                </div>
                <div>
                    <span className="badge badge-secondary padding-medium uppercase">Bun Venit {state.nume_utilizator}</span> &nbsp;&nbsp;
                    <button onClick={handleSignOut} className="btn btn-primary">Logout</button>

                </div>

            </nav>
        </>
    );
}
export default NavBar