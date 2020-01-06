import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';

const DeschideComanda = (props) => {

    const comanda = (props.location.props) !== undefined ? props.location.props.comandaDetaliata : null;
    const client = new GraphQLClient('/graphql');
    const [rezolvat, setRezolvat] = useState({ msg: "Marcheaza Ca Rezolvat", disabled: false });
    const [anulat, setAnulat] = useState({ msg: "Marcheaza Ca Anulat", disabled: false });

    const handlePrint = () => {
        window.print();
    }

    const handleAnulat = async () => {
        if (window.confirm("Confirmati Anularea acestei comenzi?")) {
            setAnulat({ msg: "Comanda Anulata", disabled: true });
            let gql = `
                mutation{
                    schimba_stare_comanda(nr_comanda:${comanda.nr_comanda},stare_noua:"Comanda Anulata")
                  }
                `
            await client.request(gql)
                .then(data => {
                    setRezolvat({ msg: "Comanda Anulata", disabled: true });
                })
        }
    }

    const handleRezolvat = async () => {
        if (comanda) {
            setRezolvat({ msg: "Comanda Rezolvata", disabled: true });
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
            comanda.detalii_comanda.forEach((item) => {
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
                    // console.log(data)
                })
            // console.log(sql);
        }
    }

    useEffect(() => {
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
                client.request(gql)
                    .then(data => {
                        // console.log(data)
                    })
            }
        }
        return () => {
            setRezolvat(null);
            setAnulat(null);
        };
    }, [])

    return (
        <>
            <NavBar />
            {comanda ? (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="jumbotron jumboSettings">
                                <PrintProvider>
                                    <Print>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col">
                                                    <label className="col-sm-12 bg-primary fancyBackground font-weight-bold" >Data Comanda: {comanda.data_comanda}</label>
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
                                                    {comanda.detalii_comanda.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.articol.nume_articol}</td>
                                                            <td>{item.cantitate}</td>
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