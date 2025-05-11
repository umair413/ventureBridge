import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home/Home";
import Layout from "../layout/Layout";
import IdeasListing from "../pages/ideas-listing/IdeasListing";
import ProductDetail from "../pages/product-detail/ProductDetail";
import SignUp from "../pages/signup/SignUp";
import Login from "../pages/login/Login";
import AddProduct from "../pages/add-new-product/AddProduct";
import Profile from "../pages/profile/Profile";
import ChatInbox from "../pages/chat-inbox/ChatInbox";
import Chat from "../components/chat/Chat";
import LandingChats from "../components/landing-chats/LandingChats";

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path:'/',
            element:<Layout/>,
            children:[
                {
                    path:'/',
                    element:<Home/>
                },
                {
                    path:'ideasListing/:categoryId',
                    element:<IdeasListing/>
                },
                {
                    path:'productDetail/:id',
                    element:<ProductDetail/>
                },
                {
                    path:'addProduct',
                    element:<AddProduct/>
                },
                {
                    path:'profile/:userRole',
                    element:<Profile/>
                },
                {
                    path:'inbox/:userId',
                    element:<ChatInbox/>,
                    children:[
                        {
                            path:'landing',
                            element:<LandingChats/>
                        },
                        {
                            path:'chat/:chatId',
                            element:<Chat/>
                        }
                    ]
                }
            ],
        },
        {
            path:'signup',
            element:<SignUp/>
        },
        {
            path:'login',
            element:<Login/>
        },
        
    ])
  return <RouterProvider router={router}/>

};

export default AppRouter;
