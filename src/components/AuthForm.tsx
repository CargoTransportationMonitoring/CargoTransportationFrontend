import React, {JSX} from "react";

const AuthForm: React.FC = (): JSX.Element => {
    return (
        <div>
            <input type="text" placeholder="Username"/>
            <input type="password" placeholder="Password"/>
            <button>Submit</button>
        </div>
    );
}

export default AuthForm