import React, { useEffect, useState } from 'react';
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import produce from "immer"
import DisplayInfo from '../DisplayInfo/DisplayInfo'


const Receptie = (props) => {
    const [articole, setArticole] = useState("");
    const [receptieTerminata, setreceptieTerminata] = useState(false);
    const [articoleCantitati, setArticoleCantitati] = useState({});
    const client = new GraphQLClient('/graphql');
    useEffect(() => {
        const query = `
        {
            articole{
              id
              nume_articol
              status
              cantitate_stoc
            }
        }
        `;
        try {
            client.request(query)
                .then(data => {
                    // console.log(data);
                    setArticole(data.articole);
                    setArticoleCantitati(data.articole.map(item => {
                        return {
                            id: item.id,
                            nume_articol: item.nume_articol,
                            cantitate: 0
                        }
                    }))
                    // console.log(state)
                })
        } catch (err) {
            console.log(err);
        }
        return () => {
            setArticoleCantitati(null);
            setArticole(null);
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        let articoleSelectate = articoleCantitati.filter(item => item.cantitate !== 0);
        let articoleSelectatePtGraph = articoleSelectate.map(item => ({
            nume_articol: item.nume_articol,
            cantitate: parseInt(item.cantitate)
        }))
        // console.log(articoleSelectatePtGraph);
        let q = "";
        articoleSelectatePtGraph.forEach(item => {
            // console.log(item);
            q += `{nume_articol:"${item.nume_articol}",cantitate:"${item.cantitate}"},`
        })
        let newS = q.substring(0, q.length - 1);
        let query = `
        mutation{
            modifica_stoc_articole(lista_articole:[${newS}])               
        }
        `;
        // console.log(query);
        client.request(query)
            .then(data => {
                //console.log(data)
                setreceptieTerminata(true)
            }).catch(err => console.log(err))
    }

    const handleChange = (e) => {
        // console.log(e.target.getAttribute("data-id"));
        let data = { id: e.target.getAttribute("data-id"), cantitate: e.target.value }
        if (!isNaN(data.cantitate)) {
            setArticoleCantitati(
                produce((draftState) => {
                    draftState.find(item => item.id === data.id).cantitate = data.cantitate
                })
            )
        } else {
            e.target.value = articoleCantitati.find(item => item.id === data.id).cantitate;
        }
    }

    return (
        <>

            <NavBar />
            {!receptieTerminata ? (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron jumboSettings">
                                <h2 className="text-center jumboSettings fancyText neg-ml-1">Inventar - Modifica Stoc</h2>
                                <br />
                                <br />
                                <div className="container fancyText font-weight-bold">
                                    <div className="row">
                                        <div className="offset-sm-1 col-sm-8">
                                            <div className="form-group row text-right">
                                                <span className="col-sm-7 col-form-label">Nume Articol</span>
                                                <div className="col-sm-4 text-left">
                                                    <span className="col-sm float-left neg-ml-1 col-form-label">Stoc Actual</span>
                                                </div>
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                {articole && articole.map(item => {
                                                    if (item.status !== "inactive") {
                                                        return (
                                                            <div key={item.id} className="form-group row text-right">
                                                                <label htmlFor="Articol" className="col-sm-7 col-form-label">{item.nume_articol}</label>
                                                                <div className="col-sm-3">
                                                                    <input autoComplete="false" type="text" placeholder="cantitate" className="form-control" data-id={item.id} onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else return null
                                                })}
                                                <br />
                                                <div className="form-group row">
                                                    <button className="offset-sm-6 col-sm-3 btn btn-primary">Ajusteaza Cantitati</button>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                    <DisplayInfo msg={"Intrari introduse cu succes"} />
                )}
        </>
    );
}
export default Receptie