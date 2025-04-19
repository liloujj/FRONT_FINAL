import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter, Route, Routes,Navigate
} from "react-router-dom";
import { routes } from '../../containers/routes';
import BaseLayout from "../BaseLayout/BaseLayout";
import ActivateAcount from '../../containers/Login/ActivateAcount';

function BaseApp(props) {
    const dispatch = useDispatch()
    const {role} = useSelector((state)=>state.login)
    const { dir, otherActionButtons } = props
    return <BrowserRouter basename={process.env.PUBLIC_URL}>
        <BaseLayout
            dir={dir}
            otherActionButtons={otherActionButtons}
            links={routes.filter((item)=> item.role === "Any" || item.role === role).map((route) => ({ title: route.title, icon: route.icon, path: route.path }))}
            onLogoutClicked={() => {
                //dispatch(logout())
            }}>
            <Routes>
                <Route path="/" element={<Navigate to="/appointments" replace />} />
                {routes.filter((item)=> item.role === "Any" || item.role === role).map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        element={route.component}
                    />

                ))}
            </Routes>
        </BaseLayout>
    </BrowserRouter>
}

export default BaseApp