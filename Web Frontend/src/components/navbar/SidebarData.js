import React from 'react';
import {FaShoppingCart, FaRegListAlt}  from 'react-icons/fa';
import {BsFillPeopleFill}  from 'react-icons/bs';
import {ImCheckboxChecked}  from 'react-icons/im';
import {BiAnalyse}  from 'react-icons/bi';

//Side Menu Bar Items
export const SidebarData = [
  {
    title: 'Products',
    path: '/products',
    icon: <FaShoppingCart/>,
    className: 'nav-text',
    id: 'products-page'
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: <FaRegListAlt/>,
    className: 'nav-text',
    id: 'orders-page'
  },
  {
    title: 'Delivered',
    path: '/deliveredorders',
    icon: <ImCheckboxChecked/>,
    className: 'nav-text',
    id: 'delivered-page'
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: <BsFillPeopleFill/>,
    className: 'nav-text',
    id: 'customers-page'
  },
  {
    title: 'Review Analysis',
    path: '/reviewanalysis',
    icon: <BiAnalyse/>,
    className: 'nav-text',
    id: 'reviewanalysis-page'
  }
];
