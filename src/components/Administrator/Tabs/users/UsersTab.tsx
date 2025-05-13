import React, {JSX, useState} from "react";
import LinkUserWindow from "./LinkUserWindow";

const UsersTab: React.FC = (): JSX.Element => {

    const [isModalAdminOpen, setIsModalAdminOpen] = useState<boolean>(false);

    return (
        <>
            <div>
                <button onClick={() => setIsModalAdminOpen(true)}>Прикрепить грузоперевозчика</button>
                <LinkUserWindow onCancel={() => setIsModalAdminOpen(false)} isOpen={isModalAdminOpen}/>
            </div>
            <div>

            </div>
        </>
    )
}

export default UsersTab