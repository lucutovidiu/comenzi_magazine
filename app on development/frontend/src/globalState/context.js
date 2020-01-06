import { createContext } from 'react'

const initState = {
    id_user: sessionStorage.getItem("id_user") ? sessionStorage.getItem("id_user") : null,
    ultima_logare: sessionStorage.getItem("ultima_logare") ? sessionStorage.getItem("ultima_logare") : null,
    nume_utilizator: sessionStorage.getItem("nume_utilizator") ? sessionStorage.getItem("nume_utilizator") : null
}
const Context = createContext(initState);

export default Context;