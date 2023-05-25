import React from 'react'
import styles from './styles.module.scss'
import { FiTrash2 } from 'react-icons/fi'

interface ItemProps{
    data:{
        id: string;
        product_id: string;
        name:string;
        amount: string | number;
        price: string
    }
    deleteItem: (item_id: string) => void;
    subValue: (price: string) => void;
}

export function ListItem({data, deleteItem, subValue}: ItemProps){

    function handleDeleteItem(){
        deleteItem(data.id)
        subValue(data.price)
    }

    return(
        <div className={styles.container}>
            <p className={styles.item}>{data.amount} - {data.name} - R${Number(data.price) * Number(data.amount)}</p>

            <button onClick={handleDeleteItem}>
                <FiTrash2 color='#ff3f4b' size={25} />
            </button>
        </div>
    )
}

