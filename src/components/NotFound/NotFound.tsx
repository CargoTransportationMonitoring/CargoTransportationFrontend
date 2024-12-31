import React, {JSX} from "react";
import {NavLink} from "react-router-dom";

interface NotFoundProps {
    role: string
}

const NotFound: React.FC<NotFoundProps> = ({role}: NotFoundProps): JSX.Element => {


    return (
        <>
            <h1>Page Not Found.</h1>
            <NavLink to={role === 'admin' ? '/admin' : '/main'}>Main Page</NavLink>
        </>
    )
}

export default NotFound