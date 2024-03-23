import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const AlertClient = withReactContent(Swal); 


//Titulo y mensajes definidos succes | error | confirm 

//Alerta para error
//Alerta para succes
//Alerta para confirmar

export const customAlert = (title, text, icon) =>{
    return AlertClient.fire({
        title, 
        text, 
        icon, 
        confirmButtonColor:'#3085d6',
        confirmButtonText: 'Aceptar'
    })
}

export const confirmAlert = (preConfirm) =>{
    return AlertClient.fire({
        title: '¿Estás seguro de realizar la acción?',
        text: 'Le solicitamos esperar a que termine la acción',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !AlertClient.isLoading(),
        preConfirm, 
    }); 

}; 