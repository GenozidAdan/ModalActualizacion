import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Navbar } from 'flowbite-react';
import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

const UserLayout = () => {

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" />
            <header>
                <Navbar fluid rounded>
                    <Navbar.Brand as={Link} href="https://flowbite-react.com">
                        <img src="../../../../assets/admin.jpg" className="mr-3 h-6 sm:h-9" alt="User" />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">User</span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Navbar.Link href="#" active>
                            Home
                        </Navbar.Link>
                        <Navbar.Link as={Link} href="#">
                            About
                        </Navbar.Link>
                        <Navbar.Link href="#">Services</Navbar.Link>
                        <Navbar.Link href="#">Pricing</Navbar.Link>
                        <Navbar.Link href="#">Contact</Navbar.Link>
                    </Navbar.Collapse>
                </Navbar>
            </header>

            <div className='flex'>
                <aside>
                    <Sidebar aria-label="Sidebar with content separator example">
                        <Sidebar.Items>
                            <Sidebar.ItemGroup>
                                <li>
                                    <Link to={"admin"} className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                        <HiChartPie className='h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
                                        <span className="px-3 flex-1 whitespace-nowrap">
                                            Dashboard
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"users"} className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                        <HiViewBoards className='h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' />
                                        <span className="px-3 flex-1 whitespace-nowrap">
                                            Jose Manuel
                                        </span>
                                    </Link>
                                </li>
                                <Sidebar.Item as={Link} href="admin" icon={HiChartPie}>
                                    Dashboard
                                </Sidebar.Item>
                                <Sidebar.Item as={Link} href="users" icon={HiViewBoards}>
                                    Kanban
                                </Sidebar.Item>
                                <Sidebar.Item as={Link} href="products" icon={HiInbox}>
                                    Inbox
                                </Sidebar.Item>
                                <Sidebar.Item href="#" icon={HiUser}>
                                    Users
                                </Sidebar.Item>
                                <Sidebar.Item href="#" icon={HiShoppingBag}>
                                    Products
                                </Sidebar.Item>
                                <Sidebar.Item href="#" icon={HiArrowSmRight}>
                                    Sign In
                                </Sidebar.Item>
                                <Sidebar.Item href="#" icon={HiTable}>
                                    Sign Up
                                </Sidebar.Item>
                            </Sidebar.ItemGroup>
                            <Sidebar.ItemGroup>
                                <Sidebar.Item href="#" icon={HiChartPie}>
                                    Upgrade to Pro
                                </Sidebar.Item>
                                <Sidebar.Item href="#" icon={HiViewBoards}>
                                    Documentation
                                </Sidebar.Item>
                                <Sidebar.Item href="#" icon={BiBuoy}>
                                    Help
                                </Sidebar.Item>
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </Sidebar>
                </aside>

                <main className="w-full">
                    <section className="px-4 pt-2 pb-8">
                        <Outlet />

                    </section>
                </main>
            </div>

        </>
    );
}

export default UserLayout;
