import React, {JSX, useState} from "react";
import LinkUserWindow from "./LinkUserWindow";

const UsersTab: React.FC = (): JSX.Element => {

    const [isModalAdminOpen, setModalAdminOpen] = useState<boolean>(false);

    return (
        <>
            <div>
                <button onClick={() => setModalAdminOpen(true)}>Прикрепить грузоперевозчика</button>
                <LinkUserWindow onCancel={() => setModalAdminOpen(false)} isOpen={isModalAdminOpen}/>
            </div>
            <div>

            </div>
        </>
    )
}

export default UsersTab