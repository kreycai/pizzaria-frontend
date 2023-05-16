import Modal from 'react-modal'
import styles from './styles.module.scss'
import { FiX } from 'react-icons/fi'
import { FiShoppingCart } from 'react-icons/fi'

interface ModalFinishProps{
    isOpen: boolean;
    finishOrder: (id: string) => void;
    onRequestClose: () => void;
    info: {
        order_id: string;
        table: string;
    }
}

export function ModalFinish({ isOpen, finishOrder, onRequestClose, info }:ModalFinishProps){
    function handleFinishOrder(){
        finishOrder(info.order_id)
    }

    
    const customStyles = {
        content:{
            top: '50%', 
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1d1d2e'
        }
    }

    return(
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        >
            <div className={styles.container} onClick={onRequestClose}>
                <h2 className={styles.alert}>Você deseja finalizar esse pedido ?</h2>
                <p className={styles.title}>Mesa {info.table}</p>
                <button className={styles.button} onClick={handleFinishOrder}>
                    <p className={styles.textButton}>Finalizar pedido</p>
                    <FiShoppingCart size={20} color='#1d1d2e'/>
                </button>
            </div>
        </Modal>
    )
}