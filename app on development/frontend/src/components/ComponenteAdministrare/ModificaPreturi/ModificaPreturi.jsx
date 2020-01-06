import React, { useEffect, useState } from 'react';
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import produce from "immer"
import DisplayInfo from '../DisplayInfo/DisplayInfo'


const ModificaPreturi = (props) => {
    const [articole, setArticole] = useState("");
    const [preturiSchimbate, setpreturiSchimbate] = useState(false);
    const [articoleCantitati, setArticoleCantitati] = useState({});
    const client = new GraphQLClient('/graphql');
    useEffect(() => {
        const query = `
        {
            articole{
              id
              nume_articol
              pret
              status
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
                            pret: 0
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
        let articoleSelectate = articoleCantitati.filter(item => item.pret !== 0);
        let articoleSelectatePtGraph = articoleSelectate.map(item => ({
            nume_articol: item.nume_articol,
            pret: parseFloat(item.pret)
        }))
        //console.log(articoleSelectatePtGraph);
        let q = "";
        articoleSelectatePtGraph.forEach(item => {
            // console.log(item);
            q += `{nume_articol:"${item.nume_articol}",pret_articol:${item.pret}},`
        })
        let newS = q.substring(0, q.length - 1);
        let query = `
        mutation{
            modifica_preturi(lista_preturi:[${newS}])       
       }
        `;
        // console.log(query);
        client.request(query)
            .then(data => {
                //console.log(data)
                setpreturiSchimbate(true)
            }).catch(err => console.log(err))
    }

    const handleChange = (e) => {
        let data = { id: e.target.getAttribute("data-id"), pret: e.target.value }
        if (!isNaN(data.pret)) {
            setArticoleCantitati(
                produce((draftState) => {
                    draftState.find(item => item.id === data.id).pret = data.pret
                })
            )
        } else {
            e.target.value = articoleCantitati.find(item => item.id === data.id).pret;
        }
    }

    return (
        <>

            <NavBar />
            {!preturiSchimbate ? (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron jumboSettings">
                                <h2 className="text-center jumboSettings fancyText neg-ml-1">Modificare Preturi Articole</h2>
                                <br />
                                <br />
                                <div className="container fancyText font-weight-bold">
                                    <div className="row">
                                        <div className="offset-sm-2 col-sm-7">
                                            <div className="form-group row text-right">
                                                <div className="col-sm-5 ">
                                                    <span >Nume Articol</span>
                                                </div>
                                                <div className="col-sm-3">
                                                    <span className="col-sm">Pret Actual</span>
                                                </div>
                                                <div className="col-sm-3">
                                                    <span className="col-sm">Pret Nou</span>
                                                </div>
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                {articole && articole.map(item => {
                                                    if (item.status !== "inactive") {
                                                        return (
                                                            <div key={item.id} className="form-group row text-right">
                                                                <div className="col-sm-5 ">
                                                                    <label htmlFor="Articol" >{item.nume_articol}</label>
                                                                </div>
                                                                <div className="col-sm-3 text-center">
                                                                    <span className="">{item.pret}</span>
                                                                </div>
                                                                <div className="col-sm-3">
                                                                    <input autoComplete="false" type="text" placeholder="Pret Nou" className="form-control" data-id={item.id} onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else return null
                                                })}
                                                <br />
                                                <div className="form-group row">
                                                    <button className="offset-sm-6 col-sm-3 btn btn-primary">+ Schimba Preturile</button>
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
                    <DisplayInfo msg={"Preturi Modificate cu success"} />
                )}
        </>
    );
}
export default ModificaPreturi