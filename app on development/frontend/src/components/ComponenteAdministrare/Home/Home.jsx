import React from 'react';
// import { useEffect, useContext } from 'react';
// import Context from '../../globalState/context'
import NavBar from '../../ComponentaNavBar/NavBar'

const Home = (props) => {
    // const { state, dispatch } = useContext(Context);

    return (
        <>
            <NavBar props={props} />
        </>
    );

}

export default Home