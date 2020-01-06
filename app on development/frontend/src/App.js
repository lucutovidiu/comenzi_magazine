// import 'style/bootstrap-datepicker.min.css'
import React, { useContext, useReducer, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SignIn from './components/ComponentaLogare/SignIn'
// import NoMatch from './components/nopage/NoMatch'
import Context from './globalState/context'
import reducer from './globalState/reducer'
// import CreareComanda from './components/ComponentaCreareComanda/CreareComanda'
import Home from './components/ComponenteAdministrare/Home/Home'
// require('/style/bootstrap.min.css')
const VerificareComenzi = lazy(() => import('./components/ComponenteAdministrare/VerificareComenzi/VerificareComenzi'));
const DeschideComanda = lazy(() => import('./components/ComponenteAdministrare/VerificareComenzi/DeschideComanda'));
const AdaugaArticole = lazy(() => import('./components/ComponenteAdministrare/AdaugaArticole/AdaugaArticole'));
const StergeArticole = lazy(() => import('./components/ComponenteAdministrare/StergeArticole/StergeArticole'));
const AdaugaMagazinNou = lazy(() => import('./components/ComponenteAdministrare/AdaugaMagazinNou/AdaugaMagazinNou'));
const Receptie = lazy(() => import('./components/ComponenteAdministrare/Receptie/Receptie'));
const ModificaPreturi = lazy(() => import('./components/ComponenteAdministrare/ModificaPreturi/ModificaPreturi'));
const VerificaStocActual = lazy(() => import('./components/ComponenteAdministrare/VerificaStocActual/VerificaStocActual'));
const Inventar = lazy(() => import('./components/ComponenteAdministrare/Inventar/Inventar'));
const RaportComenziData = lazy(() => import('./components/ComponenteRapoarte/RaportComenziData/RaportComenziData'));
const RaportComenziPerMagazine = lazy(() => import('./components/ComponenteRapoarte/RaportComenziPerMagazine/RaportComenziPerMagazine'));
const CreareComanda = lazy(() => import('./components/ComponentaCreareComanda/CreareComanda'));

const App = (props) => {
  //console.log(CreareComanda);
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BrowserRouter>
      <Context.Provider value={{ state, dispatch }}>
        <Suspense fallback={<div>...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={SignIn} />
            <Route path="/CreareComanda" component={CreareComanda} />
            <Route path="/VerificareComenzi" component={VerificareComenzi} />
            <Route path="/DeschideComanda" component={DeschideComanda} />
            <Route path="/AdaugaArticole" component={AdaugaArticole} />
            <Route path="/StergeArticole" component={StergeArticole} />
            <Route path="/AdaugaMagazinNou" component={AdaugaMagazinNou} />
            <Route path="/Receptie" component={Receptie} />
            <Route path="/ModificaPreturi" component={ModificaPreturi} />
            <Route path="/VerificaStocActual" component={VerificaStocActual} />
            <Route path="/Inventar" component={Inventar} />
            <Route path="/RaportComenziData" component={RaportComenziData} />
            <Route path="/RaportComenziPerMagazine" component={RaportComenziPerMagazine} />
            <Route component={Home} />
          </Switch>
        </Suspense>
      </Context.Provider >
    </BrowserRouter >
  );
}

export default App;
