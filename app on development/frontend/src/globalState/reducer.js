
const reducer = (state, { type, payload }) => {
    switch (type) {
        case "LOGIN_USER": {
            sessionStorage.setItem("id_user", payload.id_user);
            sessionStorage.setItem("ultima_logare", payload.ultima_logare);
            sessionStorage.setItem("nume_utilizator", payload.nume_utilizator);
            return {
                ...state,
                id_user: payload.id_user,
                ultima_logare: payload.ultima_logare,
                nume_utilizator: payload.nume_utilizator
            };
        }
        case "LOGOUT_USER": {
            sessionStorage.removeItem("id_user")
            sessionStorage.removeItem("ultima_logare");
            sessionStorage.removeItem("nume_utilizator");
            return {};
        }
        default:
            return state;
    }
}

export default reducer;
