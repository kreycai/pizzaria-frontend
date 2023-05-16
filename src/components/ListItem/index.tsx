import React from 'react'
import styles from './styles.module.scss'
import { FiTrash2 } from 'react-icons/fi'

interface ItemProps{
    data:{
        id: string;
        product_id: string;
        name:string;
        amount: string | number;
    }
    deleteItem: (item_id: string) => void;
}

export function ListItem({data, deleteItem}: ItemProps){

    function handleDeleteItem(){
        deleteItem(data.id)
    }

    return(
        <div className={styles.container}>
            <p className={styles.item}>{data.amount} - {data.name}</p>

            <button onClick={handleDeleteItem}>
                <FiTrash2 color='#ff3f4b' size={25} />
            </button>
        </div>
    )
}

