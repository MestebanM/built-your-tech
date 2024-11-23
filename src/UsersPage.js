// UsersPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UsersPage.css';
import { CartContext } from './CartContext';

const UsersPage = ({ user, onLogoutClick, onLoginClick }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: ''
  });
  const [isEditable, setIsEditable] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isIdSearched, setIsIdSearched] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();
  const { getTotalItems } = useContext(CartContext);

  const isAdmin = user && user.role === 1;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('https://buildyourtech.dtechne.com/usuarios/');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllUsers(data);
      } else {
        console.error('Datos inesperados:', data);
        setAllUsers([]);
      }
    } catch (error) {
      console.error('Error al cargar todos los usuarios:', error);
      setAllUsers([]); // Asegúrate de que allUsers sea siempre un arreglo
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSearch = async () => {
    // Validar que el campo ID de usuario no esté vacío
    if (userId.trim() === '') {
      alert('Por favor ingrese un ID de usuario válido.');
      return;
    }

    try {
      const response = await fetch(`https://buildyourtech.dtechne.com/usuarios/${userId}`);
      if (!response.ok) throw new Error('Usuario no encontrado');
      const data = await response.json();
      setUserData({
        nombre: data.nombre,
        correo: data.correo,
        contraseña: data.contraseña,
        rol: data.rol
      });
      setIsEditable(false);
      setShowConfirmButtons(false);
      setIsIdSearched(true);
      fetchAllUsers();
    } catch (error) {
      console.error('Error:', error);
      setUserData({ nombre: '', correo: '', contraseña: '', rol: '' });
      setIsEditable(false);
      alert('Usuario no encontrado');
    }
  };


  const handleCreate = () => {
    setUserData({ nombre: '', correo: '', contraseña: '', rol: '' });
    setUserId('');
    setIsEditable(true);
    setShowConfirmButtons(true);
    setIsIdSearched(false);
    setConfirmationMessage('¿Seguro que quieres crear el nuevo usuario?');
  };

  const handleCreateConfirm = async () => {
    try {
      const response = await fetch('https://buildyourtech.dtechne.com/usuarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Error al crear usuario');
      const data = await response.json();
      alert(data.success);
      setUserData({ nombre: '', correo: '', contraseña: '', rol: '' });
      setIsEditable(false);
      setShowConfirmButtons(false);
      fetchAllUsers();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Error al crear el usuario');
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    setShowConfirmButtons(true);
    setConfirmationMessage('¿Seguro que quieres confirmar los cambios?');
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://buildyourtech.dtechne.com/usuarios/${userId}/editar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Error al actualizar usuario');
      const data = await response.json();
      alert(data.success);
      setIsEditable(false);
      setShowConfirmButtons(false);
      fetchAllUsers();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Error al actualizar el usuario');
    }
  };

  const handleDelete = () => {
    setShowConfirmButtons(true);
    setConfirmationMessage('¿Seguro que quieres eliminar el usuario?');
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`https://buildyourtech.dtechne.com/usuarios/${userId}/eliminar`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar usuario');
      const data = await response.json();
      alert(data.success);
      setUserData({ nombre: '', correo: '', contraseña: '', rol: '' });
      setIsEditable(false);
      setShowConfirmButtons(false);
      fetchAllUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const handleLogout = () => {
    onLogoutClick();
    navigate('/');
  };

  const handleConfirm = () => {
    setShowConfirmationModal(true);
  };

  const handleCancel = () => {
    setIsEditable(false);
    setShowConfirmButtons(false);
    setShowConfirmationModal(false);
    setUserData({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: ''
    });
    setUserId('');
    setIsIdSearched(false); // Deshabilitar los botones "Editar" y "Eliminar"
  };


  const finalConfirm = () => {
    setShowConfirmationModal(false);

    if (confirmationMessage === '¿Seguro que quieres eliminar el usuario?') {
      handleDeleteConfirm();
    } else if (confirmationMessage === '¿Seguro que quieres crear el nuevo usuario?') {
      handleCreateConfirm();
    } else if (confirmationMessage === '¿Seguro que quieres confirmar los cambios?') {
      handleUpdate();
    }

    // Después de confirmar, limpiar y deshabilitar botones de acción
    setUserData({ nombre: '', correo: '', contraseña: '', rol: '' });
    setUserId('');
    setIsEditable(false);
    setShowConfirmButtons(false);
    setIsIdSearched(false); // Deshabilitar botones "Editar" y "Eliminar"
  };


  return (
    <div className="users-page">
      <div className="users-header">
        <button className="logo-button" onClick={() => navigate('/')}>
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BUILD-YOUR-TECH</span>
        </button>

        <div className="header-buttons">
          {isAdmin && (
            <>
              <Link to="/graficas">
                <button className="navbar-button">
                  📊 <span>Gráficas</span>
                </button>
              </Link>
              <div className="dropdown-container">
                <button className="navbar-button">Compras</button>
                <div className="dropdown-content">
                  <Link to="/compras" className="dropdown-item">Compra</Link>
                  <Link to="/caracompras" className="dropdown-item">Características de Compra</Link>
                </div>
              </div>
              <Link to="/users" className="navbar-button">Usuarios</Link>
              <Link to="/add-product" className="navbar-button">Productos</Link>
            </>
          )}
          <button className="navbar-button" onClick={() => navigate('/chat')}>Asesoría IA</button>
          {user ? (
            <div className="user-info">
              <button className="navbar-button" onClick={toggleDropdown}>
                {user.name}
              </button>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-button" onClick={onLoginClick}>Iniciar sesión</button>
          )}
          <Link to="/cart">
            <div className="cart-button">
              <span role="img" aria-label="cart">&#128722;</span>
              <span className="cart-count">{getTotalItems()}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="users-content-container">
        <div className="users-content-left">
          <h2>Gestión de Usuarios</h2>

          <div className="search-section">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="ID de usuario"
                value={userId}
                onChange={(e) => {
                  const id = e.target.value;

                  // Permitir solo números
                  if (/^\d*$/.test(id)) {
                    setUserId(id);
                    setShowConfirmButtons(false);
                    setIsEditable(false);
                    setUserData({
                      nombre: '',
                      correo: '',
                      contraseña: '',
                      rol: '',
                    });
                    setIsIdSearched(false);

                    // Deshabilitar acciones si el campo está vacío
                    if (id.trim() === '') {
                      setIsIdSearched(false);
                    }
                  }
                }}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-button">
                🔍
              </button>
            </div>
          </div>


          <div className="action-buttons">
            <button
              className="action-button"
              onClick={handleCreate}
              disabled={isIdSearched} // Botón Crear habilitado si no se ha buscado un ID
            >
              Crear
            </button>
            <button
              className="action-button"
              onClick={handleEdit}
              disabled={!isIdSearched} // Botón Editar habilitado solo si hay un ID buscado
            >
              Editar
            </button>
            <button
              className="action-button"
              onClick={handleDelete}
              disabled={!isIdSearched} // Botón Eliminar habilitado solo si hay un ID buscado
            >
              Eliminar
            </button>
          </div>


          <div className="user-details">
            <div className="user-field">
              <label>Nombre:</label>
              <input
                type="text"
                value={userData.nombre}
                onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                readOnly={!isEditable}
                className="user-input"
              />
            </div>

            <div className="user-field">
              <label>Correo:</label>
              <input
                type="text"
                value={userData.correo}
                onChange={(e) => setUserData({ ...userData, correo: e.target.value })}
                readOnly={!isEditable}
                className="user-input"
              />
            </div>

            <div className="user-field">
              <label>Contraseña:</label>
              <input
                type="text"
                value={userData.contraseña}
                onChange={(e) => setUserData({ ...userData, contraseña: e.target.value })}
                readOnly={!isEditable}
                className="user-input"
              />
            </div>

            <div className="user-field">
              <label>Rol:</label>
              <input
                type="text"
                value={userData.rol}
                onChange={(e) => setUserData({ ...userData, rol: e.target.value })}
                readOnly={!isEditable}
                className="user-input"
              />
            </div>
          </div>

          {showConfirmButtons && (
            <div className="confirm-buttons">
              <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
              <button className="confirm-button" onClick={handleConfirm}>Confirmar</button>
            </div>
          )}

          {showConfirmationModal && (
            <div className="confirmation-modal">
              <p>{confirmationMessage}</p>
              <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
              <button className="confirm-button" onClick={finalConfirm}>Confirmar</button>
            </div>
          )}
        </div>

        <div className="users-content-right">
          <h2>Todos los Usuarios</h2>
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Contraseña</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.correo}</td>
                      <td>{user.contraseña}</td>
                      <td>{user.rol}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay usuarios disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
