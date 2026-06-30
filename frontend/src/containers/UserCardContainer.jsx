import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/UserCardContainer.module.css';
import axios from 'axios'
import UserCard from '../components/UserCard';
/* Para usar el contexto del outlet */
import { useOutletContext } from 'react-router-dom';


function UserCardContainer({ isActiveList }) {
    const { users } = useOutletContext();

    const activeUsers = users.filter(usuario => usuario.enLinea === 1);

    return (
        <div className={styles.userCardContainer}>
            {isActiveList
                ? activeUsers.map((activeUser) => (
                    // El guion medio une el ID y el estado. Si el estado cambia, la key cambia.
                    <UserCard key={`${activeUser.id}-${activeUser.enLinea}`} user={activeUser} />
                ))
                : users.map((user) => (
                    <UserCard key={`${user.id}-${user.enLinea}`} user={user} />
                ))
            }
        </div>
    );

}

export default UserCardContainer;