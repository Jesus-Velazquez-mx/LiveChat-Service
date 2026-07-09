import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/UserCardContainer.module.css';
import axios from 'axios'
import UserCard from '../components/UserCard';
/* Para usar el contexto del outlet */
import { useOutletContext } from 'react-router-dom';


function UserCardContainer({ isActiveList }) {
    const { users, handleCardClick } = useOutletContext();
    const { usuario } = useContext(AuthContext);

    /* Para que el usuario que inicio sesión salga tambien en la lista de activos, lo metemos manualmente a la lista */
    const usuariosSincronizados = users.map(u =>
        u.id === usuario.id ? { ...u, enLinea: 1 } : u
    );

    /* Ahora filtramos con la lista actualizada */
    const activeUsers = usuariosSincronizados.filter(u => u.enLinea === 1);
    return (
        <div className={styles.userCardContainer}>
            {isActiveList
                ? activeUsers.map((activeUser) => (
                    /* El guion medio une el ID y el estado. Si el estado cambia, la key cambia. */
                    <UserCard key={`${activeUser.id}-${activeUser.enLinea}`}
                        user={activeUser}
                        handleCardClick={handleCardClick}
                        isCurrentUser={usuario.id === activeUser.id} />
                ))
                : users.map((user) => (
                    <UserCard key={`${user.id}-${user.enLinea}`}
                        user={user}
                        handleCardClick={handleCardClick}
                        isCurrentUser={usuario.id === user.id} />

                ))
            }
        </div>
    );

}

export default UserCardContainer;