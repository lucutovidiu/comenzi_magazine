import React, { useEffect, useState } from 'react';
import NavBar from '../../ComponentaNavBar/NavBar';
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import produce from "immer" 
import { GraphQLClient } from 'graphql-request'
// import { Redirect } from './node_modules/react-router-domeact-router-dom'
// import { Button } from './node_modules/react-bootstrapreact-bootstrap'


// import PrintProvider, { Print, NoPrint } from 'react-easy-print';

const AdaugaArticole = (props) => {

    const [articol, setArticol] = useState({loading:{state:false,msg:"+Adauga Articolele In System"},list : [{ id: 1, nume_articol: "", cantitate_stoc: "", pret_articol: "" }]});
  
    
    useEffect(()=>{
        // setLoading(true);
        // console.log(articol)
        return ()=>{
            setArticol(null);
        }
    },[])

    function handleChange(componenta, value, id) {
        if ((componenta === "pret_articol" && isNaN(value)) || (componenta === "cantitate_stoc" && isNaN(value))) {
            window.alert("Doar Numere sunt acceptate ca si pret");
        } else {
            setArticol(
                produce(articol => {
                    if (componenta === "nume_articol") {
                        articol.list.find(item => item.id === id).nume_articol = ""?"":value
                    } else if (componenta === "pret_articol") {
                        articol.list.find(item => item.id === id).pret_articol = value;
                    } else if (componenta === "cantitate_stoc") {
                        articol.list.find(item => item.id === id).cantitate_stoc = value;
                    }
                })
            );
        }
    }

    function handleAdd() {
        setArticol(
            produce(draft => {
                // console.log("draft : ",articol.list);
                const newArticle = { id: draft.list.length+1, nume_articol: "", cantitate_stoc: "", pret_articol: "" };
                draft.list.push(newArticle);
            })
        );
    }

    function handleSubmit() {
        setArticol(
            produce(draft => {
                draft.loading={state:true,msg:"Se Adauga Articolele"};
            }))
        const finalList = articol.list.filter(item => String(item.nume_articol).trim() !== "").map(item => { return { nume_articol: item.nume_articol,cantitate_stoc: String(item.cantitate_stoc).trim() === "" ? "0" : item.cantitate_stoc, pret_articol: String(item.pret_articol).trim() === "" ? "0" : item.pret_articol} });
        //    console.log(finalList)
        if(finalList.length===0){
            window.alert("Pentru a trimite comanda trebuie sa introduceti cel putin un articol");
        }else{
            // console.log(finalList);
            const client = new GraphQLClient('/graphql');
            let q="";
            finalList.forEach(item=>{
                // console.log(item);
                q+=`{nume_articol:"${item.nume_articol}",cantitate_stoc:${item.cantitate_stoc},pret_articol:${item.pret_articol}},`
            })
            let newS=q.substring(0,q.length-1);
            const query = `
            mutation{
                adauga_articole(lista_articole:[${newS}])
              }
            `;
            //console.log("query",query);
                client.request(query)
                    .then(data => {
                        setArticol({loading:{state:true,msg:"Articole Introduse cu success"}});
                    })
                    .catch(err=>{
                        console.log(err);
                        setArticol({loading:{state:true,msg:"A aparut o eroare incercati dinou!"}});
                        // setArticol([{ id: 1, nume_articol: "", cantitate_stoc: "", pret_articol: "" }]);
                        //setarticoleTrimise(false);
                    });                
        }
    }

    return (
        <>
            <NavBar />
            
            <div className="jumbotron jumboSettings">
            {/* {articoleTrimise!==true?( */}
                <>
                <h2 className="fancyText font-weight-bold">Adaugare Articole</h2>
                <div className="container-fluid mt-5">
                {/* {console.log("list ",articol)} */}
                    {articol.list && articol.list.map((item) => {       

                        return (
                            <div key={item.id} className="row mt-1">
                                <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm" >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">Nume Articol&nbsp;</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl autoComplete="false" value={item.nume_articol} onChange={(e) => handleChange("nume_articol", e.target.value, item.id)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                    </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm" >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">Pret Articol &nbsp;&nbsp;&nbsp;</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl autoComplete="false" value={item.pret_articol} onChange={(e) => handleChange("pret_articol", e.target.value, item.id)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                    </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm
                                    " >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">Cantitate Stoc</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl autoComplete="false" value={item.cantitate_stoc} onChange={(e) => handleChange("cantitate_stoc", e.target.value, item.id)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                    </InputGroup>
                                </div>
                            </div>
                        )
                    })}
                    <div className="row mt-3">
                        <div className="col-md-1  offset-sm-0 col-sm-2 col-xs-2">
                            <Button style={articol.loading.state===true ? {visibility:"hidden"}:{visibility:"show"}} variant="outline-success" onClick={handleAdd}>+</Button>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-4 col-sm-6">
                            <Button disabled={articol.loading.state} onClick={handleSubmit}>{articol.loading.msg}</Button>
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
export default AdaugaArticole