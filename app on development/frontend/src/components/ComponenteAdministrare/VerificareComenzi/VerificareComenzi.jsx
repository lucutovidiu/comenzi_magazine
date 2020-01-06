import React, { useEffect, useContext, useState } from 'react';
import Context from '../../../globalState/context'
import { Redirect } from 'react-router-dom'
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Button } from 'react-bootstrap'
import CopyRight from '../../copyright/CopyRight'
import { GetFormatedDateDDMMMYYYYhhmm, SubstractMonthBeginingOfMonthYYYYMMDD, GetFormatedDateYYYYMMDD } from '../../../util/util'

const VerificareComenzi = (props) => {
    let data1 = SubstractMonthBeginingOfMonthYYYYMMDD(new Date(), 1);
    let data2 = GetFormatedDateYYYYMMDD(new Date());
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

        fetchData();
        return () => {
            setMagazine(null);
            setToateComenzile(null);
            setComandaDetaliata(null);
            setdataDeLa(null);
            setdataPanaLa(null);
            setmagazineSelectate(null);
            setisLoading(null);
        }
    }, []);

    const fetchData = () => {
        const query = `
        {
            utilizatori{
              id
              nume_utilizator
              locatie_utilizator
            }
          }
        `;
        try {
            client.request(query)
                .then(data => {
                    setMagazine(data.utilizatori.filter(item => item.nume_utilizator.startsWith("G")).sort(sort));
                    // console.log(data)
                    const query = `
            {
                comenzi_dupa_data(data_de_la:"${dataDeLa}",data_pana_la:"${dataPanaLa}"){
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
            `;
                    // console.log(query)
                    client.request(query)
                        .then(data => {
                            // console.log(data)
                            setToateComenzile(data.comenzi_dupa_data);

                        })
                })
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(magazineSelectate);
        let datad = GetFormatedDateYYYYMMDD(dataDeLa);
        let datap = GetFormatedDateYYYYMMDD(dataPanaLa);
        if (magazineSelectate === null || magazineSelectate === "Toate Magazinele") {
            setisLoading(true);
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
                    setToateComenzile(data.comenzi_dupa_data);
                    setisLoading(false)
                })
        } else {
            setisLoading(true);
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
                    setToateComenzile(data.comenzi_dupa_data_si_utilizator);
                    setisLoading(false)
                })
        }
    }

    const handleClick = (e) => {
        // console.log(e);
        if (e.IDStare !== "Comanda Anulata") {
            let response = window.confirm("Doriti sa deschideti Comanda");
            if (response) {
                let comanda = toateComenzile.filter(item => item.nr_comanda === e.nr_comanda);
                setComandaDetaliata({
                    ...comanda[0]
                })
            }
        }
    }

    const getIDStareCuloare = (stare) => {
        if (stare === "Comanda Nevizualizata")
            return { backgroundColor: "#e74c3c", cursor: "pointer" };
        else if (stare === "Comanda Vizualizata")
            return { backgroundColor: "#f39c12", cursor: "pointer" };
        else if (stare === "Comanda Rezolvata")
            return { backgroundColor: "#27ae60", cursor: "pointer" };
        else if (stare === "Comanda Anulata")
            return { backgroundColor: "#bdc3c7" };
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
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col">
                                <div className="jumbotron jumboSettings">
                                    <h2 className="text-center jumboSettings fancyText font-weight-bold neg-mt-1">Verificare Comenzi</h2>
                                    <br />
                                    <div className="container-fluid">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <div className="fancyText col-sm mb-1">Data De La</div>
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
                                                    <div className="form-group">
                                                        <Button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary">Verifica Comenzi</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {toateComenzile && (
                                        <div className="table-responsive-sm">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">NR Comanda</th>
                                                        <th scope="col">Data Comanda</th>
                                                        <th scope="col">Nume Magazin</th>
                                                        <th scope="col">Locatie Magazin</th>
                                                        <th scope="col">Stare Comanda</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {toateComenzile.map(item => (
                                                        <tr style={getIDStareCuloare(item.IDStare)} id={item.nr_comanda} onClick={() => { handleClick(item) }} key={item.nr_comanda}>
                                                            <th scope="row" >{item.nr_comanda}</th>
                                                            <td>{GetFormatedDateDDMMMYYYYhhmm(item.data_comanda)}
                                                                {/* { moment(new Date(item.data_comanda)).format("DD-MMM-YYYY HH:mm").toString()} */}
                                                            </td>
                                                            <td>{item.utilizator.nume_utilizator}</td>
                                                            <td>{item.utilizator.locatie_utilizator}</td>
                                                            <td>{item.IDStare}</td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    <CopyRight />
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


export default VerificareComenzi

