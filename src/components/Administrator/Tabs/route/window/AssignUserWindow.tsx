import React from 'react';

const AssignUserWindow: React.FC<{
    username: string | undefined
}> = () => {

    const handleAssignUser = (): void => {

    }



    return (
        <button onClick={handleAssignUser}>Assign User</button>
    )
};

export default AssignUserWindow;