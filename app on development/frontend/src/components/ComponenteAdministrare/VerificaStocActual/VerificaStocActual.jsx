import React, { useEffect, useState } from 'react';
import NavBar from '../../ComponentaNavBar/NavBar';
import { GraphQLClient } from 'graphql-request'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';


const VerificaStocActual = (props) => {
    const [articole, setArticole] = useState("");
    const client = new GraphQLClient('/graphql');
    useEffect(() => {
        const query = `
        {
            articole{
              id
              nume_articol
              pret
              cantitate_stoc
              status
            }
        }
        `;
        try {
            client.request(query)
                .then(data => {
                    // console.log(data);
                    setArticole(data.articole);
                    // console.log(state)
                })
        } catch (err) {
            console.log(err);
        }
        return () => {
            setArticole(null);
        }
    }, [])



    return (
        <>
            <NavBar />
            <PrintProvider>
                <Print>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col">
                                <div className="jumbotron jumboSettings">
                                    <h2 className="text-center jumboSettings fancyText">Vizualizare Stoc si Preturi Actuale Articole</h2>
                                    <br />
                                    <br />
                                    <div className="container fancyText font-weight-bold">
                                        <div className="row">
                                            <div className="offset-sm-2 col-sm-7">
                                                <div className="form-group row text-right">
                                                    <span className="col-sm-6 col-form-label">Nume Articol</span>
                                                    <div className="col-sm-3">
                                                        <span className="col-sm float-left col-form-label">Pret Actual</span>
                                                    </div>
                                                    <div className="col-sm-3 text-center">
                                                        <span className="col-sm float-left col-form-label">Stoc Actual</span>
                                                    </div>
                                                </div>
                                                {articole && articole.map(item => {
                                                    if (item.status !== "inactive") {
                                                        return (
                                                            <div key={item.id} className="form-group row text-right">
                                                                <label htmlFor="Articol" className="col-sm-6 col-form-label">{item.nume_articol}</label>
                                                                <div className="col-sm-3 text-center">
                                                                    <span className="">{item.pret}</span>
                                                                </div>
                                                                <div className="col-sm-3 text-center">
                                                                    <span >{item.cantitate_stoc}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else return null
                                                })}
                                                <br />
                                                <NoPrint>
                                                    <div className="form-group row">
                                                        <button onClick={() => { window.print(); }} className="offset-sm-6 col-sm-3 btn btn-primary">Printeaza Stocuri</button>
                                                    </div>
                                                </NoPrint>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Print>
            </PrintProvider>
        </>
    );
}
export default VerificaStocActual