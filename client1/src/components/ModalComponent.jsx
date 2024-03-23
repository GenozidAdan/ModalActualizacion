import React, { useState } from 'react';
import { Button, Card, Label, Modal, TextInput, Select } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { confirmAlert, customAlert } from '../config/alert/alert';
import { backIn } from 'framer-motion';
import AxiosClient from '../config/http-gateway/http-client';

const UserSaveForm = ({ openModal, getAllusers, setOpenModal }) => {
    const closeModal = () => {
        formik.resetForm();
        setOpenModal(false);
    };
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            role: "",
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
            password: yup
                .string()
                .required('La contraseña es requerida')
                .max(50, 'La contraseña no puede tener más de 45 caracteres')
                .min(5, 'La contraseña no puede tener menos de 5 caracteres'),
            confirmPassword: yup
                .string().test('passwords-match', 'Las contraseñas no coinciden',
                    function (value) { return this.parent.password === value; })
                .required('La confirmación de contraseña es requerida')
                .max(50, 'La confirmación de contraseña no puede tener más de 45 caracteres')
                .min(5, 'La confirmación de contraseña no puede tener menos de 5 caracteres'),
            role: yup.string()
                .min(1, 'El rol es requerido')
                .required('El rol es requerido')
                .test('selecciona un role', 'Se debe seleccionar un rol', function (value) {
                    return value !== 'Seleccionar..'; // Ensure the selected value is not the placeholder
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
            lastname: yup
                .string()
                .required('El segundo apellido es requerido'),
            curp: yup
                .string()
                .required('El CURP es requerido')
                .max(18, 'El CURP no puede tener más de 18 caracteres')
                .min(18, 'El CURP no puede tener menos de 18 caracteres'),
            birthdate: yup
                .string()
                .required('La fecha de nacimiento es requerida'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            confirmAlert(async () => {
                try {
                    //values -> person 
                    const payload = {
                        ...values,
                        birthDate: values.birthdate,
                        user: {
                            username: values.username,
                            password: values.password,
                            avatar: values.avatar,
                            roles: [{ id: values.role }],
                        }
                    };

                    const response = await AxiosClient({
                        url: "/person/",
                        method: "POST",
                        data: payload, //values
                    });
                    if (!response.error) {
                        customAlert('Exito',
                            'Usuario registrado correctamente',
                            'success');
                        getAllusers();
                        closeModal();
                    }
                    return response;
                }
                catch (error) {
                    console.log(error);
                    customAlert('Error',
                        'Ocurrio un error al registrar el usuario',
                        'error');
                }
                finally {
                    setSubmitting(false);
                }
            });
        },
    });

    const [avatarUrl, setAvatarUrl] = useState('');

    const handleChangeAvatar = (event) => {
        const files = event.target.files;
        if (files.length > 0 && files.length < 2)
            for (const file of files) {
                const reader = new FileReader();
                reader.onloadend = (data) => {
                    formik.setFieldValue('avatar', data.target.result);
                    formik.setFieldTouched('avatar', true);
                };
                reader.readAsDataURL(file);
            }
    };



    return (
        <Modal style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} show={openModal} size={'2xl'} onClose={() => setOpenModal(false)}>
            <Modal.Header>Registrar usuario</Modal.Header>

            <Modal.Body>
                <form
                    id="saveUserform"
                    name='saveUserform'
                    noValidate onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-4 m-2">
                        <Card className="flex flex-col">
                            <h3 className="font-bold text-xl">Datos de usuario</h3>
                            <div className="flex">
                                <div className="w-1/2 p-2">
                                    <Label
                                        htmlFor="username"
                                        className="font-bold"
                                        value="Usuario"
                                    />
                                    <TextInput
                                        id="username"
                                        name="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.username && formik.errors.username ?
                                            (<span className="text-sm text-red-600">
                                                {formik.errors.username}
                                            </span>) : null
                                        }
                                        type="text"
                                        placeholder="erielit"
                                    />
                                </div>
                                <div className="w-1/2 p-2">
                                    <Label htmlFor="role" className="font-bold" value="Rol"
                                    />
                                    <Select
                                        id="role"
                                        name="role"
                                        placeholder="erielit"
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.role && formik.errors.role ?
                                                (<span className="text-sm text-red-600">
                                                    {formik.errors.role}
                                                </span>) : null
                                        }

                                    >
                                        <option value="Seleccionar..">Seleccionar..</option>
                                        <option value="1">ADMIN</option>
                                        <option value="3">CLIENT</option>
                                        <option value="2">USER</option>
                                    </Select>


                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-1/2 p-2">
                                    <Label
                                        htmlFor="password"
                                        className="font-bold"
                                        value="Contraseña"
                                    />
                                    <TextInput
                                        id="password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.password && formik.errors.password ?
                                            (<span className="text-sm text-red-600">
                                                {formik.errors.password}
                                            </span>) : null
                                        }
                                        type="password"
                                        placeholder="erielit"
                                    />
                                </div>
                                <div className="w-1/2 p-2">
                                    <Label
                                        htmlFor="confirmPassword"
                                        className="font-bold"
                                        value="Confirmar contraseña"
                                    />
                                    <TextInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword ?
                                            (<span className="text-sm text-red-600">
                                                {formik.errors.confirmPassword}
                                            </span>) : null
                                        }
                                        type="password"
                                        placeholder="erielit"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="avatar" className="font-bold" value="Avatar" />
                                <TextInput
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    size={'sm'}
                                    onChange={(e) => handleChangeAvatar(e)}
                                />
                                {avatarUrl && (
                                    <img src={avatarUrl} alt="Avatar Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                )}

                            </div>

                        </Card>
                        <Card className="flex flex-col">
                            <h3 className="font-bold text-xl">Datos personales</h3>
                            <div className="flex gap-4">
                                <div className="w-full"> {/* Cambiado a w-full */}
                                    <Label htmlFor="name" value="Nombre" className="font-bold" />
                                    <TextInput type="text" placeholder="Mike" id="name" name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.name && formik.errors.name ?
                                            (<span className="text-sm text-red-600">
                                                {formik.errors.name}
                                            </span>) : null
                                        } />
                                </div>
                                <div className="w-full"> {/* Cambiado a w-full */}
                                    <Label htmlFor="surname" value="Primer apellido" className="font-bold" />
                                    <TextInput type="text" placeholder="Moreno" id="surname" name="surname"
                                        value={formik.values.surname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.surname && formik.errors.surname ?
                                            (<span className='text-sm text-red-600'>
                                                {formik.errors.surname}
                                            </span>) : null
                                        } />
                                </div>
                                <div className="w-full"> {/* Cambiado a w-full */}
                                    <Label htmlFor="lastname" value="Segundo apellido" className="font-bold" />
                                    <TextInput type="text" placeholder="Velasquez" id="lastname" name="lastname"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.lastname && formik.errors.lastname ?
                                            (<span className='text-sm text-red-600' >
                                                {formik.errors.lastname}
                                            </span>) : null
                                        } />
                                </div>
                            </div>

                            <div className="flex"> {/* Wrap the last two fields */}
                                <div className="w-1/2 p-2"> {/* Adjusted width */}
                                    <Label htmlFor="curp" className="font-bold" value="CURP" />
                                    <TextInput type="text" placeholder="MOVM980119" id="curp" name="curp"
                                        value={formik.values.curp}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.curp && formik.errors.curp ?
                                            (<span className='text-sm text-red-600'>
                                                {formik.errors.curp}
                                            </span>) : null
                                        } />
                                </div>
                                <div className="w-1/2 p-2"> {/* Adjusted width */}
                                    <Label htmlFor="birthdate" className="font-bold" value="Fecha de nacimiento" />
                                    <TextInput type="date" placeholder="MOVM980119" id="birthdate" name="birthdate"
                                        value={formik.values.birthdate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={formik.touched.birthdate && formik.errors.birthdate ?
                                            (<span className='text-sm text-red-600'>
                                                {formik.errors.birthdate}
                                            </span>) : null
                                        } />
                                </div>
                            </div>
                        </Card>
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Cancelar
                </Button>
                <Button
                    type="submit" color="success" form='saveUserform'>
                    Registrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserSaveForm;
