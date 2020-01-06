import React, { useState, useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import Context from '../../globalState/context';
import CopyRight from '../copyright/CopyRight';


function SignIn(props) {
    const { dispatch } = useContext(Context);
    let storeLocal, storePassLocal;
    if (typeof window.localStorage !== "undefined") {
        storeLocal = localStorage.getItem("store_name") ? localStorage.getItem("store_name") : "";
        storePassLocal = localStorage.getItem("store_password") ? localStorage.getItem("store_password") : "";
    }
    const [store_name, setstore_name] = useState(storeLocal);
    const [store_password, setstore_password] = useState(storePassLocal);
    const [loginError, setloginError] = useState("");

    const handleSubbmit = async (e) => {
        e.preventDefault();
        setloginError("");
        const query = `
        {
            login(nume:"${store_name}",parola_utilizator:"${store_password}"){
              id
              nume_utilizator
              ultima_logare
            }
        }
        `;
        const client = new GraphQLClient('/graphql');
        try {
            let data = await client.request(query);
            if (data.login === null) {
                setloginError("User sau Parola Gresite!");
            } else {
                const userData = {
                    id_user: data.login.id,
                    ultima_logare: data.login.ultima_logare,
                    nume_utilizator: data.login.nume_utilizator
                }
                dispatch({ type: "LOGIN_USER", payload: { ...userData } });
                if (data.login.nume_utilizator.toUpperCase().startsWith("G")) {
                    props.history.push(`/CreareComanda`);
                }
                else {
                    props.history.push(`/`);
                }
                //console.log(data);
                //console.log("ultima logare: ", data.login.ultima_logare)
            }
        } catch (err) {
            setloginError("User sau Parola Gresite!");
        }

    }

    return (
        <main>
            <center>
                {/* <img className="responsive-img" style="width: 250px;" src="https://i.imgur.com/ax0NCsK.gif" /> */}

                <div className="container vertical-center" >

                    <div className="jumbotron " style={{ display: "inline-block", padding: "32px 48px 0px 48px", border: "1px solid #EEE" }}>
                        <h5 className="indigo-text" style={{ fontFamily: "'Merienda One', cursive" }}>Comenzi Magazine Unicarm</h5>
                        <br />
                        <form className="col-sm-12" onSubmit={handleSubbmit}>
                            <div className="form-row font-weight-bold">
                                <label htmlFor="nume_magazin">Nume Magazin</label>
                                <input type="text" className="form-control" id="nume_magazin" placeholder="Nume Magazin" value={store_password} onChange={(e) => { setstore_password(e.target.value) }} required />
                            </div>
                            <br />
                            <div className="form-row font-weight-bold">
                                <label htmlFor="parola">Parola</label>
                                <input type="password" className="form-control" id="parola" placeholder="Parola" value={store_name} onChange={(e) => { setstore_name(e.target.value) }} required />
                            </div>
                            <br /><br />
                            <center>
                                <div className='row'>
                                    <button type='submit' className='col-sm-12 btn btn-primary'>Login</button>
                                </div>
                            </center>
                            <div className="row">
                                <div className="input-field col-sm-12" >
                                    <h6 style={{ color: "#e67e22", display: "block", padding: "1.5rem" }}>&nbsp;{loginError}</h6>
                                </div>
                                <CopyRight />
                            </div>
                        </form>
                    </div>
                </div>
            </center>
        </main >
    );
}


export default SignIn;