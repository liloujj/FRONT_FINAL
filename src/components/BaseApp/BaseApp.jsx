import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter, Route, Routes,Navigate
} from "react-router-dom";
import { routes } from '../../containers/routes';
import BaseLayout from "../BaseLayout/BaseLayout";
import Document from '../../containers/Document/Document';
import io from 'socket.io-client';

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
                <Route path='/document/:document_id' element={<Document isMedical={false}/>} />
                <Route path='/document-doctor/:document_id' element={<Document isMedical={true}/>} />

            </Routes>
        </BaseLayout>
    </BrowserRouter>
}

export default BaseApp