import React, { useEffect, useContext, useState } from 'react';
import Context from '../../globalState/context'
import NavBar from '../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import produce from "immer"
import { Redirect } from 'react-router-dom'
import DisplayInfo from '../ComponenteAdministrare/DisplayInfo/DisplayInfo'
import { YYYYMMDDhhmmss } from '../../util/util'
import $ from 'jquery'


const CreareComanda = (props) => {
    const { state } = useContext(Context);
    const [articole, setArticole] = useState("");
    const [nrComanda, setNrComanda] = useState("");
    const [articoleCantitati, setArticoleCantitati] = useState({});
    const [loading, setLoading] = useState({ msg: "Trimite Comanda", state: false });
    const client = new GraphQLClient('/graphql');
    useEffect(() => {
        const query = `
        {
            articole{
              id
              nume_articol
              status
            }
        }
        `;
        try {
            client.request(query)
                .then(data => {
                    //console.log(data);
                    setArticole(data.articole);
                    setArticoleCantitati(data.articole.map(item => {
                        return {
                            id: item.id,
                            nume_articol: item.nume_articol,
                            cantitate: 0
                        }
                    }))
                    //console.log(state)
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

        let articoleSelectate = articoleCantitati.filter(item => parseInt(item.cantitate) !== 0);
        if (articoleSelectate.length === 0) {
            alert("Nu puteti trimite o comanda fara articole!!!");
        } else {
            setLoading({ msg: "Asteptati!!! Se trimite Comanda", state: true })
            let articoleSelectatePtGraph = articoleSelectate.map(item => ({
                id_articol: item.id,
                cantitate: parseInt(item.cantitate)
            }))
            let currentTime = YYYYMMDDhhmmss(new Date());
            console.log("current time: " + currentTime)
            // console.log(articoleSelectatePtGraph);
            // console.log(currentTime); 
            let query = `
        mutation{
            adauga_comanda(id_utilizator:${state.id_user},data_comanda:"${currentTime}",IDStare:"1",lista_articole:${JSON.stringify(articoleSelectatePtGraph).replace(/"/g, "")}) {
              nr_comanda
            }
          }
        `;
            // console.log(articoleSelectate);
            let tableBody = "";
            articoleSelectate.forEach(art => {
                tableBody += `
                <tr>
                    <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;">${art.nume_articol}</td>
                    <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;">${art.cantitate}</td>
                </tr>
            `
            })

            let htmlEmail = `
        <br/><br/>
        &nbsp;&nbsp;&nbsp;<h3>Comanda Noua ${state.nume_utilizator.toUpperCase()}</h3>
        <br/><br/>
        <table width="auto" cellspacing="12" cellpadding="6" style="border:1px solid #ccc;" >
        <thead>
        <tr style="text-align:left">
        <th scope="col" style="border-bottom:1px solid #ccc;padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;line-height:30px">Nume Articol</th>
        <th scope="col" style="border-bottom:1px solid #ccc;padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;line-height:30px">Cantitate</th>
        </thead>
        <tbody>
        ${tableBody}
    </tbody>
</table>
        <br/> <br/>
        Cu respect,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Comenzi Magazine Unicarm
        `;
            // console.log(htmlEmail)
            client.request(query)
                .then(data1 => {

                    let configEmail = {
                        emailMsg: htmlEmail,
                        emailSubject: "O noua comanda a fost creata de catre " + state.nume_utilizator.toUpperCase(),
                        emailToAddress: state.nume_utilizator.toUpperCase() + "@unicarm.ro;controlfacturi@unicarm.ro;it@unicarm.ro"
                    }
                    // let origin = window.origin;
                    //console.log("email to send: " + configEmail);                    
                    $.ajax
                        ({
                            type: "POST",
                            //the url where you want to sent the userName and password to
                            url: '/api/SendMail',
                            dataType: 'json',
                            contentType: 'application/json',
                            //json object to sent to the authentication url
                            data: JSON.stringify(configEmail),
                            success: function () {
                                setNrComanda(data1.adauga_comanda.nr_comanda)
                            }
                        })
                    // $.post('/api/SendMail', { email: configEmail }, function () {
                    //     setNrComanda(data.adauga_comanda.nr_comanda);
                    // }, "json");
                    // axios.post(origin + '/api/SendMail', configEmail)
                    //     .then(function () {
                    //         setNrComanda(data.adauga_comanda.nr_comanda)
                    //     });

                }).catch(err => console.log(err))
        }
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
            {!state.id_user && <Redirect to="/login" />}
            <NavBar />
            {!nrComanda ? (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron jumboSettings">
                                <h2 className="text-center jumboSettings">Introducere Comanda Noua</h2>
                                <br />
                                <br />
                                <div className="container fancyText font-weight-bold">
                                    <div className="row">
                                        <div className="offset-sm-1 col-sm-8">
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
                                                    else return null;

                                                })}
                                                <br />
                                                <div className="form-group row">
                                                    <button disabled={loading.state} className={!loading.state ? "offset-sm-6 col-sm-3 btn btn-primary" : "offset-sm-6 col-sm-3 btn btn-danger"}>{loading.msg}</button>
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
                    <DisplayInfo msg={"Comanda Introdusa cu success!! Numarul de comanda este: " + nrComanda} />
                )}
        </>
    );
}
export default CreareComanda