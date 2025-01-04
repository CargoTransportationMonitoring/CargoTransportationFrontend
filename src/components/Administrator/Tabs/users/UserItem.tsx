import React, {JSX} from "react";

const UserItem: React.FC<{
    username: string
}> = ({username}): JSX.Element => {
    return (
        <div>
            {username}
        </div>
    )
}