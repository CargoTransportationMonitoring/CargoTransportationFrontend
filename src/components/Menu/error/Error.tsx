import {Dispatch} from "@reduxjs/toolkit";
import React, {JSX, useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clearError, clearInfo, clearWarn, selectError, selectInfo, selectWarn} from "../../../redux/slices/InfoTabSlice";

const Error: React.FC = (): JSX.Element => {
    const errorMessage: string = useSelector(selectError)
    const infoMessage: string = useSelector(selectInfo)
    const warnMessage: string = useSelector(selectWarn)
    const dispatch: Dispatch = useDispatch()

    useEffect((): void => {
        if (errorMessage) {
            toast.error(`Error: ${errorMessage}`)
            dispatch(clearError({}))
        }
        if (infoMessage) {
            toast.info(`Info: ${infoMessage}`)
            dispatch(clearInfo({}))
        }
        if (warnMessage) {
            toast.warn(`Warn: ${warnMessage}`)
            dispatch(clearWarn({}))
        }
    }, [errorMessage, infoMessage, warnMessage, dispatch])
    return (
        <ToastContainer position='top-right' autoClose={4000}/>
    )
}

export default Error;