import React, {JSX} from "react";
import styles from './CreateRouteWindow.module.css'
import Map from "../../../Map/MapComponent";
import MapComponent from "../../../Map/MapComponent";

const CreateRouteWindow: React.FC<{
    onCreate: () => void;
    onCancel: () => void;
}> = ({onCreate, onCancel}): JSX.Element => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Создать маршрут</h2>
                <MapComponent/>
                <p>Вы уверены, что хотите создать маршрут?</p>
                <div className={styles.buttons}>
                    <button onClick={onCreate} className={styles.button}>Create</button>
                    <button onClick={onCancel} className={styles.button}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default CreateRouteWindow