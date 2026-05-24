 //hola 

import { registrarUsuarioCompleto } from './auth.js';

const crearAdmin = async () => {
  try {
    const user = await registrarUsuarioCompleto(
      'andresmecaemal@gmail.com',
      'me_gustan_los_salchicones',
      {
        nombre: 'Administrador Principal',
        cedula: '0000000000',
        fecha: '1990-01-01',
        rol: 'Admin'
      }
    );
    console.log('Admin creado exitosamente:', user.uid);
    alert('Admin creado. UID: ' + user.uid + '\nYa puedes eliminar este script.');
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') {
      alert('El usuario admin ya existe. No es necesario recrearlo.');
    } else {
      console.error(' Error creando admin:', e);
      alert('Error: ' + e.message);
    }
  }
};

crearAdmin();
