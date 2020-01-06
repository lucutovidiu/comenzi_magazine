import React from 'react';
import { Redirect } from 'react-router-dom'

const DisplayInfo = (props) => {
    // console.log(props);
    return (
        <>
            {!props.msg && <Redirect to="/" />}
            <div className="jumbotron jumboSettings">
                <h2 className="text-center fancyBackground fancyText bg-primary jumboSettings">{props.msg}</h2>
            </div>
        </>
    );
}
export default DisplayInfo