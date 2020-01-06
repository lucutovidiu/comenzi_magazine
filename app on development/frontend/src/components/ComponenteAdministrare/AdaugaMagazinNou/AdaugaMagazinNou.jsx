import React, { useEffect, useState } from 'react';
import NavBar from '../../ComponentaNavBar/NavBar';
import { InputGroup,Form, FormControl, Button } from 'react-bootstrap'
import produce from "immer" 
import { GraphQLClient } from 'graphql-request'
// import { Redirect } from './node_modules/react-router-domeact-router-dom'
// import { Button } from './node_modules/react-bootstrapreact-bootstrap'


// import PrintProvider, { Print, NoPrint } from 'react-easy-print';

const AdaugaMagazinNou = (props) => {

    const [magazine, setmagazine] = useState({loading:{state:false,msg:"+Adauga Magazin Nou",err:false},list : [{id:1, nume_utilizator:"",locatie_utilizator:"",parola_utilizator:""}]});
  
    
    useEffect(()=>{
        // setLoading(true);
        // console.log(magazine.loading.state)
        return ()=>{
            setmagazine(null);
        }
    },[])

    function handleChange(componenta, value, id) {
            setmagazine(
                produce(magazine => {
                    if (componenta === "nume_utilizator") {
                        magazine.list.find(item => item.id === id).nume_utilizator = value
                    } else if (componenta === "locatie_utilizator") {
                        magazine.list.find(item => item.id === id).locatie_utilizator = value;
                    } else if (componenta === "parola_utilizator") {
                        magazine.list.find(item => item.id === id).parola_utilizator = value;
                    }
                })
            );
        }

    function handleAdd() {
        setmagazine(
            produce(draft => {
                // console.log("draft : ",magazine.list);
                const newArticle = {id:draft.list.length+1, nume_utilizator:"",locatie_utilizator:"",parola_utilizator:""};
                draft.list.push(newArticle);
            })
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        setmagazine(
            produce(draft => {
                draft.loading={state:true,msg:"Se Adauga Magazinul(le)"};
            }))
        const finalList = magazine.list.filter(item => String(item.nume_utilizator).trim() !== "").map(item => { return { nume_utilizator: item.nume_utilizator.toUpperCase(),locatie_utilizator: item.locatie_utilizator.charAt(0).toUpperCase() + item.locatie_utilizator.slice(1), parola_utilizator: String(item.parola_utilizator).trim()} });
       //console.log(finalList)
        
            //console.log(emptyLists);
            const client = new GraphQLClient('/graphql');
            let q="";
            finalList.forEach(item=>{
                // console.log(item);
                q+=`{nume_utilizator:"${item.nume_utilizator}",locatie_utilizator:"${item.locatie_utilizator}",parola_utilizator:"${item.parola_utilizator}"},`
            })
            let newS=q.substring(0,q.length-1);
            const query = `
            mutation{
                adauga_utilizatori(utilizatori:[${newS}])
            }
            `;
            //console.log("query",query);
                client.request(query)
                    .then(data => {
                        setmagazine({loading:{state:true,msg:finalList.length>1?"Magazine Introduse cu success":"Magazin Introdus cu success"}});
                    })
                    .catch(err=>{
                        console.log(err);
                        setmagazine({loading:{state:true,msg:"A aparut o eroare incercati dinou!"}});
                        // setmagazine([{ id: 1, nume_magazine: "", cantitate_stoc: "", pret_magazine: "" }]);
                        //setmagazineeTrimise(false);
                    });                
        
    }

    return (
        <>
            <NavBar />
            
            <div className="jumbotron jumboSettings">
            {/* {magazineeTrimise!==true?( */}
                <>
                <h2 className="fancyText font-weight-bold">Adaugare Magazin(e)</h2>
                <div className="container-fluid mt-5">
                {/* {console.log("list ",magazine)} */}
                <Form  onSubmit={handleSubmit}>
                    {magazine.list && magazine.list.map((item) => {      
                        return (                            
                            <div key={item.id} className="row mt-1">                            
                                <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm" >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">Nume Magazin&nbsp;</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control autoComplete="false" required={true} value={item.nume_utilizator} onChange={(e) => handleChange("nume_utilizator", e.target.value, item.id)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />                                                                 
                                    </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm" >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">Locatie Magazin &nbsp;</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl autoComplete="false" required={true} value={item.locatie_utilizator} onChange={(e) => handleChange("locatie_utilizator", e.target.value, item.id)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                    </InputGroup>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <InputGroup size="sm
                                    " >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroup-sizing-sm">Parola Magazin</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl type="password" required={true} autoComplete="false" value={item.parola_utilizator} onChange={(e) => handleChange("parola_utilizator", e.target.value, item.id)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                    </InputGroup>
                                </div>                                
                            </div>                              
                        )
                    })}
                    <div className="row mt-3">
                        <div className="col-md-1  offset-sm-0 col-sm-2 col-xs-2">
                            <Button style={magazine.loading.state===true ? {visibility:"hidden"}:{visibility:"show"}} variant="outline-success" onClick={handleAdd}>+</Button>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-4 col-sm-6">
                            <Button type="submit" disabled={magazine.loading.state}>{magazine.loading.msg}</Button>
                        </div>
                    </div>
                    </Form>                    
                </div>
                </>
            </div>
            
        </>
    );
}

export default AdaugaMagazinNou