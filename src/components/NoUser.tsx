import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { RouteComponentProps } from "@reach/router";
import { IndentityContext } from '../context/authContext';

const NoUser: React.FC<RouteComponentProps> = (props) => {

    const { identity } = useContext(IndentityContext);
    return(
        <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: "90vh" }}>
            <h3>Please Login To Contiue visiting Dashboard.</h3>
            <Button variant='dark' className="w-25" onClick={() => {identity.open()}}>Login</Button>
        </div>
    );
}

export default NoUser;