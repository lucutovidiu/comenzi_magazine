import React, { useEffect, useState } from 'react';
import NavBar from '../../ComponentaNavBar/NavBar';
import { Button } from 'react-bootstrap'
import produce from "immer"
import { GraphQLClient } from 'graphql-request'
//https://www.npmjs.com/package/react-bootstrap-typeahead
//http://ericgio.github.io/react-bootstrap-typeahead/
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const StergeArticole = (props) => {

    const [articole, setArticole] = useState({ loading: { state: false, msg: "- Dezactiveaza Articolele Selectate Din System" }, userSelected: [] });
    const client = new GraphQLClient("/graphql");

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

        client.request(query)
            .then(data => {
                // console.log(data.articole[0])
                setArticole(produce(draft => {
                    draft.list = data.articole.filter(item => item.status !== "inactive")
                }));

            })
        return () => {
            setArticole(null);
        }
    }, [])
    function handleSubmit() {
        setArticole(produce(draft => {
            draft.loading.state = true;
            draft.loading.msg = "Se Dezactiveaza Articolele Selectate..."
        }));
        let art = "";
        articole.userSelected.forEach(item => {
            art += `"${item}",`
        })
        art = art.substring(0, art.length - 1);
        const query = `mutation{
            sterge_articole(lista_articole:[${art}])
            }`
        client.request(query)
            .then(data => {
                setArticole(produce(draft => {
                    draft.loading.state = true;
                    draft.loading.msg = "S-au dezactivat articolele cerute"
                }));
            })
    }

    return (
        <>
            <NavBar />
            <div className="jumbotron jumboSettings">
                <>
                    <h2 className="fancyText font-weight-bold">Dezactiveaza Articole</h2>
                    <div className="container-fluid mt-5">
                        {typeof articole.list !== 'undefined' ? (
                            <Typeahead
                                disabled={articole.loading.state}
                                id="optiuni"
                                // maxResults={4}
                                // paginate
                                labelKey="name"
                                multiple
                                onChange={(selected) => {
                                    setArticole({ ...articole, userSelected: selected })
                                }}
                                options={articole.list.map(item => item.nume_articol)}
                                placeholder="Alege Articole spre a fi dezactivate..."
                            />) : null}

                        <div className="row mt-3">
                            <div className="col-md-5 col-sm-8">
                                <Button disabled={articole.loading.state} onClick={handleSubmit}>{articole.loading.msg}</Button>
                            </div>
                        </div>
                    </div>
                </>
                {/* //):(
                    // <h2 className="fancyText font-weight-bold">Articole Salvate Cu Success</h2>
                //)} */}
            </div>

        </>
    );
}
export default StergeArticole