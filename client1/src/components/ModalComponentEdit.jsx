import React, { useEffect } from 'react';
import { Button, Card, Label, Modal, TextInput, Select } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { confirmAlert, customAlert } from '../config/alert/alert';
import AxiosClient from '../config/http-gateway/http-client';

const ModalComponentEdit = ({ openModal, userToEdit, getAllUsers, setOpenModal }) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            role: '',
            avatar: '',
            name: '',
            surname: '',
            lastname: '',
            curp: '',
            birthdate: '',
        },
        validationSchema: yup.object().shape({
            username: yup
                .string()
                .required('El usuario es requerido')
                .max(45, 'El usuario no puede tener más de 45 caracteres')
                .min(5, 'El usuario no puede tener menos de 5 caracteres'),
            role: yup
                .string()
                .min(1, 'El rol es requerido')
                .required('El rol es requerido')
                .test('selecciona un role', 'Se debe seleccionar un rol', function (value) {
                    return value !== 'Seleccionar..';
                }),
            name: yup
                .string()
                .required('El nombre es requerido')
                .max(50, 'El nombre no puede tener más de 50 caracteres')
                .min(3, 'El nombre no puede tener menos de 3 caracteres'),
            surname: yup
                .string()
                .required('El primer apellido es requerido')
                .max(50, 'El primer apellido no puede tener más de 50 caracteres')
                .min(3, 'El primer apellido no puede tener menos de 3 caracteres'),
            lastname: yup.string().required('El segundo apellido es requerido'),
            curp: yup
                .string()
                .required('El CURP es requerido')
                .max(18, 'El CURP no puede tener más de 18 caracteres')
                .min(18, 'El CURP no puede tener menos de 18 caracteres'),
            birthdate: yup.string().required('La fecha de nacimiento es requerida'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            confirmAlert(async () => {
                try {
                    const payload = {
                        id: userToEdit.id,
                        ...values,
                        birthDate: values.birthdate,
                        user: {
                            id: userToEdit.id,
                            username: values.username,
                            avatar: values.avatar,
                            roles: [{ id: values.role }],
                        },
                    };

                    const response = await AxiosClient({
                        method: 'PUT',
                        url: `/user/${userToEdit.id}`,
                        data: payload,
                    });
                    if (response.error) {
                        customAlert('Éxito', 'Usuario actualizado correctamente', 'success');
                        getAllUsers();
                        closeModal();
                    }
                    return response;
                } catch (error) {
                    console.error(error);
                    customAlert('Error', 'Ocurrió un error al actualizar el usuario', 'error');
                } finally {
                    setSubmitting(false);
                }
            });
        },
    });

    useEffect(() => {
        if (userToEdit) {
            formik.setValues({
                username: userToEdit.username || '',
                role: userToEdit.roles?.[0]?.id || '',
                avatar: userToEdit.avatar || '',
                name: userToEdit.person?.name || '',
                surname: userToEdit.person?.surname || '',
                lastname: userToEdit.person?.lastname || '',
                curp: userToEdit.person?.curp || '',
                birthdate: userToEdit.person?.birthDate || '',
            });
        }
    }, [userToEdit]);

    const closeModal = () => {
        formik.resetForm();
        setOpenModal(false);
    };

    const handleChangeAvatar = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (data) => {
                formik.setFieldValue('avatar', data.target.result);
                formik.setFieldTouched('avatar', true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} show={openModal} size={'2xl'} onClose={closeModal}>
            <Modal.Header>Editar usuario</Modal.Header>
            <Modal.Body>
                <form id="editUserForm" name="editUserForm" noValidate onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-4 m-2">
                        <Card className="flex flex-col">
                            <h3 className="font-bold text-xl">Datos de usuario</h3>
                            <div className="flex">
                                <div className="w-1/2 p-2">
                                    <Label htmlFor="username" className="font-bold" value="Usuario" />
                                    <TextInput
                                        id="username"
                                        name="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.username && formik.errors.username ? formik.errors.username : null}
                                        type="text"
                                        placeholder="Usuario"
                                    />
                                </div>
                                <div className="w-1/2 p-2">
                                    <Label htmlFor="role" className="font-bold" value="Rol" />
                                    <Select
                                        id="role"
                                        name="role"
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.role && formik.errors.role ? formik.errors.role : null}
                                    >
                                        <option value="">Seleccionar..</option>
                                        <option value="1">ADMIN</option>
                                        <option value="2">USER</option>
                                        <option value="3">CLIENT</option>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="avatar" className="font-bold" value="Avatar" />
                                <TextInput
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    size={'sm'}
                                    onChange={handleChangeAvatar}
                                />
                            </div>
                        </Card>
                        <Card className="flex flex-col">
                            <h3 className="font-bold text-xl">Datos personales</h3>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <Label htmlFor="name" value="Nombre" className="font-bold" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                                        type="text"
                                        placeholder="Nombre"
                                    />
                                </div>
                                <div className="w-full">
                                    <Label htmlFor="surname" value="Primer apellido" className="font-bold" />
                                    <TextInput
                                        id="surname"
                                        name="surname"
                                        value={formik.values.surname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.surname && formik.errors.surname ? formik.errors.surname : null}
                                        type="text"
                                        placeholder="Primer apellido"
                                    />
                                </div>
                                <div className="w-full">
                                    <Label htmlFor="lastname" value="Segundo apellido" className="font-bold" />
                                    <TextInput
                                        id="lastname"
                                        name="lastname"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.lastname && formik.errors.lastname ? formik.errors.lastname : null}
                                        type="text"
                                        placeholder="Segundo apellido"
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-1/2 p-2">
                                    <Label htmlFor="curp" className="font-bold" value="CURP" />
                                    <TextInput
                                        id="curp"
                                        name="curp"
                                        value={formik.values.curp}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.curp && formik.errors.curp ? formik.errors.curp : null}
                                        type="text"
                                        placeholder="CURP"
                                    />
                                </div>
                                <div className="w-1/2 p-2">
                                    <Label htmlFor="birthdate" className="font-bold" value="Fecha de nacimiento" />
                                    <TextInput
                                        id="birthdate"
                                        name="birthdate"
                                        value={formik.values.birthdate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.birthdate && formik.errors.birthdate ? formik.errors.birthdate : null}
                                        type="date"
                                        placeholder="Fecha de nacimiento"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button color="gray" onClick={closeModal}>
                    Cancelar
                </Button>
                <Button type="submit" color="success" form='editUserForm'>
                    Guardar cambios
                </Button>
            </Modal.Footer>
       
            </Modal>
    );
};

export default ModalComponentEdit;
