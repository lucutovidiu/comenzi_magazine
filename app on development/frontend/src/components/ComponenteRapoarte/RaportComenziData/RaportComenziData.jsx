import React, { useEffect, useContext, useState } from 'react';
import Context from '../../../globalState/context'
import { Redirect } from 'react-router-dom'
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Button } from 'react-bootstrap'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import { SubstractMonthBeginingOfMonthYYYYMMDD, GetFormatedDateYYYYMMDD } from '../../../util/util'

const RaportComenziData = (props) => {

    let data1 = SubstractMonthBeginingOfMonthYYYYMMDD(new Date(), 1);//moment(new Date()).subtract(1, 'months').startOf('month').format("YYYY/MM/DD").toString();
    let data2 = GetFormatedDateYYYYMMDD(new Date());//moment(new Date()).format("YYYY/MM/DD").toString();
    const { state } = useContext(Context);
    const client = new GraphQLClient('/graphql');
    const [magazine, setMagazine] = useState(null);
    const [toateComenzile, setToateComenzile] = useState(null);
    const [comandaDetaliata, setComandaDetaliata] = useState(null);
    const [dataDeLa, setdataDeLa] = useState(data1);
    const [dataPanaLa, setdataPanaLa] = useState(data2);
    const [magazineSelectate, setmagazineSelectate] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    // const [modal, setModal] = useState({ show: false, body: "" });

    // console.log(data);
    function sort(a, b) {
        return a.nume_utilizator.substring(1) - b.nume_utilizator.substring(1)
    }
    useEffect(() => {
        const query = `
        {
            utilizatori{
              id
              nume_utilizator
              locatie_utilizator
            }
          }
        `;
        client.request(query)
            .then(data => {
                setMagazine(data.utilizatori.filter(item => item.nume_utilizator.startsWith("G")).sort(sort));
                // console.log(data)
            })

        return () => {
            setMagazine(null);
            setToateComenzile(null);
            setComandaDetaliata(null);
            setdataDeLa(null);
            setdataPanaLa(null);
            setmagazineSelectate(null);
            setisLoading(null);
        }
    }, [])

    useEffect(() => {
        if (toateComenzile !== null)
            setisLoading(true);
    }, [toateComenzile])

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(magazineSelectate);
        let datad = GetFormatedDateYYYYMMDD(dataDeLa);//moment(new Date(dataDeLa)).format("YYYY/MM/DD");
        let datap = GetFormatedDateYYYYMMDD(dataPanaLa);//moment(new Date(dataPanaLa)).format("YYYY/MM/DD");
        if (magazineSelectate === null || magazineSelectate === "Toate Magazinele") {
            // setisLoading(true);
            const query = `
            {
                comenzi_dupa_data(data_de_la:"${datad}",data_pana_la:"${datap}"){
              nr_comanda
              IDStare
              utilizator{
              nume_utilizator
              locatie_utilizator
              }
              data_comanda
              detalii_comanda{
              articol{
              nume_articol
              cantitate_stoc
              pret
              }
              cantitate
              }
              }
              }
            `
            client.request(query)
                .then(data => {
                    data = data.comenzi_dupa_data.filter(item => item.IDStare !== "Comanda Anulata");
                    // console.log(data);
                    let raport = [];
                    data.forEach(item => {
                        item.detalii_comanda.forEach(com => {
                            if (raport.length > 0) {
                                let art = raport.find(articol => articol.nume_articol === com.articol.nume_articol);
                                if (typeof art !== "undefined") {
                                    raport.find(articol => articol.nume_articol === com.articol.nume_articol).cantitate_comandata += parseInt(com.cantitate);
                                    // raport.push({ nume_articol: com.articol.nume_articol, cantitate_comandata: art.cantitate_comandata + com.cantitate })
                                } else {
                                    raport.push({ nume_articol: com.articol.nume_articol, cantitate_comandata: parseInt(com.cantitate) });
                                }
                            } else {
                                raport.push({ nume_articol: com.articol.nume_articol, cantitate_comandata: parseInt(com.cantitate) });
                            }
                        })
                    })

                    // console.log(raport)
                    setToateComenzile(raport);
                    // setisLoading(false)
                })
        } else {
            // setisLoading(true);
            const query = `
            {
                comenzi_dupa_data_si_utilizator(data_de_la:"${datad}",data_pana_la:"${datap}",utilizator:"${magazineSelectate}"){
              nr_comanda
              IDStare
              utilizator{
              nume_utilizator
              locatie_utilizator
              }
              data_comanda
              detalii_comanda{
              articol{
              nume_articol
              cantitate_stoc
              pret
              }
              cantitate
              }
              }
              }
            
            `
            // console.log(query)
            client.request(query)
                .then(data => {
                    // console.log(data)
                    data = data.comenzi_dupa_data_si_utilizator.filter(item => item.IDStare !== "Comanda Anulata");
                    let raport = [];
                    data.forEach(item => {
                        item.detalii_comanda.forEach(com => {
                            if (raport.length > 0) {
                                let art = raport.find(articol => articol.nume_articol === com.articol.nume_articol);
                                if (typeof art !== "undefined") {
                                    raport.find(articol => articol.nume_articol === com.articol.nume_articol).cantitate_comandata += parseInt(com.cantitate);
                                    // raport.push({ nume_articol: com.articol.nume_articol, cantitate_comandata: art.cantitate_comandata + com.cantitate })
                                } else {
                                    raport.push({ nume_articol: com.articol.nume_articol, cantitate_comandata: parseInt(com.cantitate) });
                                }
                            } else {
                                raport.push({ nume_articol: com.articol.nume_articol, cantitate_comandata: parseInt(com.cantitate) });
                            }
                        })
                    })
                    // console.log(raport)
                    setToateComenzile(raport);
                    // setisLoading(false)
                })
        }
    }


    // console.log(toateComenzile)
    return (
        <>
            {!state.id_user && <Redirect to="/login" />}
            <NavBar />
            {comandaDetaliata ? (
                <Redirect to={{
                    pathname: '/DeschideComanda',
                    props: { comandaDetaliata }
                }} />
                // props.history.push('/login'),
                // <DeschideComanda props={comandaDetaliata[0]} />
            ) : (
                    <div className="container-fluid ">
                        <div className="row">
                            <div className="col">
                                <div className="jumbotron jumboSettings">
                                    <PrintProvider>
                                        <Print>
                                            <h2 className="text-center jumboSettings fancyText font-weight-bold neg-mt-1">Raport Comenzi dupa data si magazin(e)</h2>
                                            <br />
                                            <div className="container-fluid">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <div className="fancyText col-sm">Data De La</div>
                                                                <DatePicker
                                                                    onChange={(e) => { setdataDeLa(e) }}
                                                                    selected={new Date(dataDeLa)}
                                                                    dateFormat="dd - MMM - yyyy"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <div className="fancyText  col-sm mb-1" >Data Pana La</div>
                                                                <DatePicker
                                                                    onChange={(e) => { setdataPanaLa(e) }}
                                                                    selected={new Date(dataPanaLa)}
                                                                    dateFormat="dd - MMM - yyyy"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <div className="row">
                                                                    <div className="fancyText  col-sm-12 mb-1">Magazin</div>
                                                                    <select onChange={(e) => { setmagazineSelectate(e.target.value) }} className="custom-select offset-sm-4 col-sm-4">
                                                                        <option  >Toate Magazinele</option>
                                                                        {magazine !== null ? magazine.map(item => (
                                                                            <option key={item.id} value={item.id}>{item.nume_utilizator}</option>
                                                                        )) : null}

                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-4 offset-sm-4 offset-md-5 col-md-2">
                                                            <NoPrint>
                                                                <div className="form-group">
                                                                    <Button onClick={handleSubmit} className="btn btn-primary">Verifica Comenzi</Button>
                                                                </div>
                                                            </NoPrint>
                                                        </div>

                                                    </div>
                                                </form>
                                            </div>
                                            {toateComenzile && (
                                                <div className="table-responsive-sm">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Nume Articol</th>
                                                                <th scope="col">Cantitate Comandata</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {toateComenzile.map((item, index) => (
                                                                <tr key={index}>
                                                                    <th scope="row">{item.nume_articol}</th>
                                                                    <td>{item.cantitate_comandata}</td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            <NoPrint>
                                                <Button style={{ visibility: !isLoading && "hidden" }} onClick={() => { window.print() }} className="btn btn-success" >Printeaza Raport</Button> &nbsp;&nbsp;
                                            </NoPrint>
                                        </Print>
                                    </PrintProvider>
                                </div>
                            </div>
                        </div>
                        {/* 
                        <Modal show={modal.show} >
                            <Modal.Header closeButton>
                                <Modal.Title>Eroare</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{modal.body}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => { setModal({ show: false }) }}>
                                    Am Inteles
                                </Button>
                            </Modal.Footer>
                        </Modal> */}
                    </div >
                )}

        </>
    );
}


export default RaportComenziData

