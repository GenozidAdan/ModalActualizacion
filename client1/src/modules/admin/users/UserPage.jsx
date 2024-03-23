import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button } from 'flowbite-react';
import AxiosClient from '../../../config/http-gateway/http-client';
import TableComponent from '../../../components/TableComponent';
import { LiaTrashSolid, LiaEdit, LiaTrashRestoreSolid } from "react-icons/lia";
import { FaSearch } from "react-icons/fa";
import { Card } from 'flowbite-react';
import { Label } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import { TextInput } from 'flowbite-react';
import ModalComponent from '../../../components/ModalComponent';
import ModalComponentEdit from '../../../components/ModalComponentEdit';
import { confirmAlert, customAlert } from '../../../config/alert/alert';

const UserPage = () => {
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [userToEdit, setUserToEdit] = useState(null);

    const columns = useMemo(() => [
        {
            name: "#",
            cell: (row, index) => <>{index + 1}</>,
            sortable: true,
            selector: (row, index) => index + 1,
        },
        {
            name: "Avatar",
            cell: (row) => (row.avatar ?
                <Avatar img={row.Avatar} /> : <>NA</>),
        },

        {
            name: "Usuario",
            cell: (row) => <>{row.username}</>,
            sortable: true,
            selector: (row) => row.username,
        },
        {
            name: "Rol",
            cell: (row, index) => <>{row.roles[0].name}</>,
            sortable: true,
            selector: (row, index) => row.roles[0].name,
        },
        {
            name: "Estado",
            cell: (row) =>
                <Badge color={row.status ? 'success' : 'failure'}>
                    {row.status ? 'ACTIVO' : 'INACTIVO'}
                </Badge>,
            sortable: true,
            selector: (row) => row.status,
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className="flex gap-2 p-2">
                    <Button outline pill color='warning' size={'sm'} onClick={() => handleEditUser(row)}>
                        <LiaEdit />
                    </Button>
                    <Button outline color={row.status ? 'failure' : 'success'} pill size={'sm'} onClick={() => handleDeleteUser(row)}>
                        {row.status ? <LiaTrashSolid /> : <LiaTrashRestoreSolid />}
                    </Button>
                </div>
            )
        }
    ], []);

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await AxiosClient({
                url: "/user/",
                method: "GET",
            });
            console.log(response);
            if (!response.error) setUsers(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteUser = async (user) => {
        confirmAlert(async () => {
            try {
                setLoading(true);
                const response = await AxiosClient({
                    url: `/user/${user.id}`,
                    method: "PATCH",
                    data: { status: !user.status }
                });
                if (!response.error) {
                    customAlert('Éxito', 'Usuario actualizado correctamente', 'success');
                    getUsers();
                } else {
                    throw new Error('Error al actualizar el usuario');
                }
            } catch (error) {
                console.log(error);
                customAlert('Error', 'Ocurrió un error al actualizar el usuario', 'error');
            } finally {
                setLoading(false);
            }
        });
    };

    const handleEditUser = (user) => {
        const userToEdit = {
            id: user.id,
            username: user.username,
            roles: user.roles,
            avatar: user.avatar,
            name: user.name,
            surname: user.surname,
            lastname: user.lastname,
            curp: user.curp,
            birthdate: user.birthdate,
        };
        console.log('Usuario a editar:', user); // Agregar este console.log
    setUserToEdit(user);
    setOpenModalEdit(true); // Abre el modal de edición
    setOpenModal(false); 
    };
    

    const filter = () => {
        return users.filter(user => user.username.includes(filterText));
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <section className="flex flex-col pt-4 px-3">
                <div>
                    <h4 className='text-2x1'>Usuarios</h4>
                </div>
                <div className='flex w-full justify-between'>
                    <div className="max-w-md">
                        <Label htmlFor="search" value="Buscar" />
                        <TextInput id="search" type="text"
                            rightIcon={FaSearch}
                            placeholder="Buscar..."
                            onChange={(e) => setFilterText(e.target.value)}
                            value={filterText} />
                    </div>
                    <div className='justify-center'>
                        <Button pill outline color='success' onClick={() => setOpenModal(true)}>Agregar</Button>
                    </div>
                </div>
                <Card>
                    <TableComponent
                        columns={columns}
                        data={filter()}
                        progress={loading} />
                </Card>
            </section>
            {/* Renderiza el modal de agregar si openModal es true */}
            {openModal &&
                <ModalComponent
                    getAllusers={getUsers}
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                />}
            {/* Renderiza el modal de edición si openModalEdit es true y hay un usuario para editar */}
            {openModalEdit && userToEdit &&
                <ModalComponentEdit
                    userToEdit={userToEdit}
                    getAllusers={getUsers}
                    setOpenModal={setOpenModalEdit}
                    openModal={openModalEdit}
                />}
        </>
    );
};

export default UserPage;
