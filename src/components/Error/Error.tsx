import React, {JSX, useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clearError, selectError} from "../../redux/slices/ErrorSlice";

const Error: React.FC = (): JSX.Element => {
    const errorMessage: string = useSelector(selectError)
    const dispatch = useDispatch()

    useEffect((): void => {
        if (errorMessage) {
            toast.error(`Error: ${errorMessage}`)
            dispatch(clearError({}))
        }
    }, [errorMessage, dispatch])
    return (
        <ToastContainer position='top-right' autoClose={2000}/>
    )
}

export default Error;