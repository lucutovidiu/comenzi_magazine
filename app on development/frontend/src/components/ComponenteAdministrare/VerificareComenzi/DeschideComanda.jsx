import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import produce from 'immer'
import { GetFormatedDateDDMMMYYYYhhmm } from '../../../util/util'
import $ from 'jquery'

const DeschideComanda = (props) => {

    const comanda = (props.location.props) !== undefined ? props.location.props.comandaDetaliata : null;
    const [detalii_comanda, setdetalii_comanda] = useState(comanda !== null ? comanda.detalii_comanda : null);
    const client = new GraphQLClient('/graphql');
    const [rezolvat, setRezolvat] = useState({ msg: "Marcheaza Ca Rezolvat", disabled: false });
    const [anulat, setAnulat] = useState({ msg: "Marcheaza Ca Anulat", disabled: false });

    const handlePrint = () => {
        window.print();
    }

    const handleAnulat = async () => {
        setRezolvat({ msg: "Se proceaseaza... Asteptati!!!", disabled: true });
        let motiv = window.prompt("Motivul anularii?");
        if (window.confirm("Confirmati Anularea acestei comenzi?")) {
            setAnulat({ msg: "Comanda Anulata", disabled: true });
            let gql = `
                mutation{
                    schimba_stare_comanda(nr_comanda:${comanda.nr_comanda},stare_noua:"Comanda Anulata")
                  }
                `
            await client.request(gql)
                .then(data => {
                    trimiteEmail(`Comanda pentru ${comanda.utilizator.nume_utilizator.toUpperCase()} a fost <span style="background-color:#e74c3c;font-size:24px">Anulata</span> pe motivul: ${motiv}`, { msg: "Comanda Anulata", disabled: true });
                })
        }
    }

    const handleRezolvat = async () => {
        if (comanda) {
            setRezolvat({ msg: "Se proceaseaza... Asteptati!!!", disabled: true });
            let gql = `
            mutation{
                schimba_stare_comanda(nr_comanda:${comanda.nr_comanda},stare_noua:"Comanda Rezolvata")
              }
            `
            // console.log(gql);
            await client.request(gql)
                .then(data => {
                    // console.log(data)
                })
            let arr = "[";
            detalii_comanda.forEach((item) => {
                arr += `{ nume_articol: "${item.articol.nume_articol}", cantitate: "${item.articol.cantitate_stoc - item.cantitate}" }`
            });
            arr += "]";
            gql = `
            mutation{
                modifica_stoc_articole(lista_articole:${arr})
              }
            `;
            await client.request(gql)
                .then(data => {
                    trimiteEmail(`Comanda pentru ${comanda.utilizator.nume_utilizator.toUpperCase()} a fost <span style="background-color:#3498db;font-size:24px">Acceptata</span>`, { msg: "Comanda Rezolvata", disabled: true });
                })
            // console.log(sql);
        }
    }

    function trimiteEmail(emailTitle, btnMsg) {
        let tableBody = "";
        detalii_comanda.forEach(art => {
            tableBody += `
            <tr>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;">${art.articol.nume_articol}</td>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;">${art.cantitate}</td>
            </tr>
        `
        })

        let htmlEmail = `
        <br/><br/>
        &nbsp;&nbsp;&nbsp;<h3>${emailTitle}</h3>
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
        let configEmail = {
            emailMsg: htmlEmail,
            emailSubject: "Actualizare comanda nr " + comanda.nr_comanda,
            emailToAddress: comanda.utilizator.nume_utilizator + "@unicarm.ro;it@unicarm.ro"
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
                    setRezolvat(btnMsg);
                }
            })
        // $.post('/api/SendMail', configEmail, function () {
        //     setRezolvat(btnMsg);
        // }, "json");
    }
    const fetchData = () => {
        if (comanda) {
            if (comanda.IDStare === "Comanda Rezolvata" || comanda.IDStare === "Comanda Anulata")
                setRezolvat({ msg: "Comanda Rezolvata", disabled: true });
            else {
                const gql = `
            mutation{
                schimba_stare_comanda(nr_comanda:${comanda.nr_comanda},stare_noua:"Comanda Vizualizata")
              }
            `
                // console.log(gql);
                client.request(gql);
            }
        }
    }
    useEffect(() => {
        fetchData();
        return () => {
            setRezolvat(null);
            setAnulat(null);
        };
    }, []);



    function handleChange(value, index) {
        // console.log(index);
        setdetalii_comanda(produce(draft => {
            if (!isNaN(value))
                draft[index].cantitate = "" + value;
        }));
    }

    return (
        <>
            <NavBar />
            {comanda ? (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron jumboSettings">
                                <PrintProvider>
                                    <Print >
                                        <div className="container">
                                            <div className="row">
                                                <div className="col">
                                                    <label className="col-sm-12 bg-primary fancyBackground font-weight-bold" >Data Comanda: {GetFormatedDateDDMMMYYYYhhmm(comanda.data_comanda)}</label>
                                                    <label className="col-sm-12 bg-primary fancyBackground font-weight-bold">Numar Comanda: {comanda.nr_comanda}</label>
                                                    <label className="col-sm-12 bg-primary fancyBackground font-weight-bold">Nume Magazin: {comanda.utilizator.nume_utilizator}</label>
                                                    <label className="col-sm-12 bg-primary fancyBackground font-weight-bold">Locatie Magazin: {comanda.utilizator.locatie_utilizator}</label>
                                                    <label className="col-sm-12 bg-primary fancyBackground font-weight-bold">Stare Comanda: {comanda.IDStare === "Comanda Nevizualizata" ? ("Comanda Vizualizata") : (comanda.IDStare)}</label>
                                                    <NoPrint>
                                                        <button className="btn btn-primary font-weight-bold" onClick={() => { props.history.push("/VerificareComenzi") }}>Inapoi</button>
                                                    </NoPrint>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive-sm">
                                            <br />
                                            <table className="table">
                                                <caption className="text-primary font-weight-bold"><h5>Total General: {parseFloat(comanda.detalii_comanda.reduce((total, acc) => {
                                                    return total + acc.cantitate * acc.articol.pret
                                                }, 0)).toFixed(2)}</h5></caption>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nume Articol</th>
                                                        <th scope="col">Cantitate Comandata</th>
                                                        <th scope="col">Pret/Articol</th>
                                                        <th scope="col">Total</th>
                                                        <th scope="col">Cantitate Pe Stoc</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detalii_comanda.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.articol.nume_articol}</td>
                                                            <td><input autoComplete="off" type="text" placeholder="cantitate trimisa" value={item.cantitate} onChange={(e) => handleChange(e.target.value, index)} className="form-control" data-id={item.id} /></td>
                                                            <td>{parseFloat(item.articol.pret).toFixed(2)}</td>
                                                            <td className="text-info">{parseFloat(item.articol.pret * item.cantitate).toFixed(2)}</td>
                                                            <td>{item.articol.cantitate_stoc}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <NoPrint>
                                                    <Button onClick={handlePrint} className="btn btn-success" >Printeaza Comanda</Button> &nbsp;&nbsp;
                                                    <Button disabled={rezolvat.disabled} onClick={handleRezolvat} className="btn btn-primary" >{rezolvat.msg}</Button>&nbsp;&nbsp;
                                                    {rezolvat.disabled !== true && (
                                                        <Button disabled={anulat.disabled} onClick={handleAnulat} className="btn btn-primary" >{anulat.msg}</Button>
                                                    )}
                                                </NoPrint>
                                            </div>
                                        </div>
                                    </Print>
                                </PrintProvider>
                            </div>
                        </div>
                    </div>

                </div>

            ) : <Redirect to="/VerificareComenzi" />}
        </>
    );
}
export default DeschideComanda