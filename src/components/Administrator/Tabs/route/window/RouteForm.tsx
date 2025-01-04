import React, {JSX} from "react";

const RouteForm: React.FC<{
    routeName: string,
    description: string,
    assignedUser: string,
    setRouteName: (routeName: string) => void,
    setDescription: (description: string) => void,
    setAssignedUser: (assignedUser: string) => void,
}> = ({routeName, description, assignedUser, setRouteName, setDescription, setAssignedUser}): JSX.Element => {

    return (
        <>
            <div>
                <label>
                    Name:
                    <input
                        placeholder={'Enter name'}
                        type="text"
                        value={routeName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        placeholder={'Enter description'}
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Assigned User:
                    <input
                        placeholder={'Enter assigned username'}
                        type="text"
                        value={assignedUser}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignedUser(e.target.value)}
                    />
                </label>
            </div>
        </>
    );
};

export default RouteForm;
