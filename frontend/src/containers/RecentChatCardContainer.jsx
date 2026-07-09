import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import RecentChatCard from '../components/RecentChatCard';
import styles from '../styles/RecentChatCardContainer.module.css'
/* Para usar el contexto del outlet */
import { useOutletContext } from 'react-router-dom';


function RecentChatCardContainer() {
    const { usuario } = useContext(AuthContext);
    const { usersConMensajes, handleCardClick } = useOutletContext();
    return (
        <div className={styles.recentChatCardContainer}>
            {usersConMensajes.map((user) => <RecentChatCard key={user.id}
                user={user} handleCardClick={handleCardClick}
                isCurrentUser={usuario.id === user.id}
                isLastMessage={usuario.id === user.remitente_id} />)}

        </div>
    )
}

export default RecentChatCardContainer;