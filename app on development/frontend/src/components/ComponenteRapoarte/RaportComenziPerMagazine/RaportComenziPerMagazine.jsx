import React, { useEffect, useContext, useState } from 'react';
import Context from '../../../globalState/context'
import { Redirect } from 'react-router-dom'
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Button } from 'react-bootstrap'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import { SubstractMonthBeginingOfMonthYYYYMMDD, GetFormatedDateYYYYMMDD, GetFormatedDateDDMMMYYYYhhmm } from '../../../util/util'

const RaportComenziPerMagazine = (props) => {

    let data1 = SubstractMonthBeginingOfMonthYYYYMMDD(new Date(), 1);//moment(new Date()).subtract(1, 'months').startOf('month').format("YYYY/MM/DD").toString();
    let data2 = GetFormatedDateYYYYMMDD(new Date());//moment(new Date()).format("YYYY/MM/DD").toString();
    const { state } = useContext(Context);
    const client = new GraphQLClient('/graphql');
    const [toateComenzile, setToateComenzile] = useState(null);
    const [comandaDetaliata, setComandaDetaliata] = useState(null);
    const [dataDeLa, setdataDeLa] = useState(data1);
    const [dataPanaLa, setdataPanaLa] = useState(data2);
    const [isLoading, setisLoading] = useState(false);

    // const [modal, setModal] = useState({ show: false, body: "" });

    // console.log(data);
    // function sort(a, b) {
    //     return a.nume_utilizator.substring(1) - b.nume_utilizator.substring(1)
    // }
    useEffect(() => {

        return () => {
            setToateComenzile(null);
            setComandaDetaliata(null);
            setdataDeLa(null);
            setdataPanaLa(null);
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

        const query = `
        {
            comenzi_dupa_data(data_de_la:"${datad}",data_pana_la:"${datap}"){
              nr_comanda
              data_comanda
              utilizator{
                nume_utilizator
                locatie_utilizator
              }
              detalii_comanda{
                articol{
                  nume_articol
                }
                cantitate
              }
            }
        }
        `;
        client.request(query)
            .then(data => {
                // setMagazine(data.utilizatori.filter(item => item.nume_utilizator.startsWith("G")).sort(sort));
                // console.log(data);
                let resultTable = data.comenzi_dupa_data.map(comenzi => {
                    return {
                        nr_comanda: comenzi.nr_comanda,
                        magazin: comenzi.utilizator.nume_utilizator,
                        locatie_magazin: comenzi.utilizator.locatie_utilizator,
                        data_comanda: comenzi.data_comanda,
                        articole_comandate: comenzi.detalii_comanda.map(com => {
                            return {
                                nume_articol: com.articol.nume_articol,
                                cantitate_comandata: com.cantitate
                            }
                        })
                    }
                })
                //console.log(resultTable);
                setToateComenzile(resultTable);
            })
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
                                            <h2 className="text-center jumboSettings fancyText font-weight-bold neg-mt-1">Raport Comenzi dupa data per magazin(e)</h2>
                                            <br />
                                            <div className="container-fluid">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <div className="fancyText-noShadow col-sm">Data De La</div>
                                                                <DatePicker
                                                                    onChange={(e) => { setdataDeLa(e) }}
                                                                    selected={new Date(dataDeLa)}
                                                                    dateFormat="dd - MMM - yyyy"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <div className="fancyText-noShadow  col-sm mb-1" >Data Pana La</div>
                                                                <DatePicker
                                                                    onChange={(e) => { setdataPanaLa(e) }}
                                                                    selected={new Date(dataPanaLa)}
                                                                    dateFormat="dd - MMM - yyyy"
                                                                />
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

                                                <div >
                                                    {toateComenzile.map((item, index) => (
                                                        <div key={index} >
                                                            <div className="row">
                                                                <div className="col text-center jumboSettings fancyText-noShadow font-weight-bold">
                                                                    <h5> Name Magazin: {item.magazin}</h5>
                                                                    <h5> Locatie Magazin: {item.locatie_magazin}</h5>
                                                                    <h5> Data Comanda: {GetFormatedDateDDMMMYYYYhhmm(item.data_comanda)}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="container mt-4">
                                                                <div className="row">
                                                                    <div className="table-responsive-sm col">
                                                                        <table className="table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col">Nume Articol</th>
                                                                                    <th scope="col">Cantitate Comandata</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {item.articole_comandate.map((art, index) => (
                                                                                    <tr key={index}>
                                                                                        <th>{art.nume_articol}</th>
                                                                                        <td>{art.cantitate_comandata}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {/*
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
                                                    
                                                    */}
                                                </div>
                                            )}
                                            <NoPrint>
                                                <Button style={{ visibility: !isLoading && "hidden" }} onClick={() => { window.print() }} className="btn btn-success" >Printeaza Raport</Button> &nbsp;&nbsp;
                                            </NoPrint>
                                            <NoPrint>

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


export default RaportComenziPerMagazine

