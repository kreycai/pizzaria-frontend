import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import Router from 'next/router';
import Modal from 'react-modal';
import { ModalFinish } from '../../components/ModalFinish';
import { toast } from 'react-toastify'
import { setupApiClient } from '@/services/api';
import styles from './styles.module.scss'
import { ListItem } from '../../components/ListItem';
import { FiTrash2 } from 'react-icons/fi'
import { AuthContext } from '@/contexts/AuthContext';

export type CategoryProps = {
    id: string;
    name: string;
}

type ProductProps = {
    id: string,
    name: string
}

type ItemsProps = {
    id: string;
    product_id: string;
    name:string;
    amount: string | number;
}

type QueryParams = {
    order_id: string;
    table:  string;
}


export default function OrderItem(){
    const { socket } = useContext(AuthContext);
    const route = useRouter();
    const api = setupApiClient();
    const { order_id, table } = route.query as QueryParams

    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState(-1)
    const [product, setProduct] = useState<ProductProps[] | []>([])
    const [productSelected, setProductSelected] = useState(-1)
    const [modalVisible, setModalVisible] = useState(false)
    const [amount, setAmount] = useState('1')
    const [items, setItems] = useState<ItemsProps[]>([])


    useEffect(()=>{
        async function loadInfo(){
            const response = await api.get('/category')
            setCategory(response.data)
        }
        loadInfo()
    }, [])

    useEffect(()=>{
        async function loadProducts(){
            if(categorySelected != -1){                
                const response = await api.get('/category/product',{
                    params:{
                        category_id:  category[categorySelected]?.id
                    }
                })
                setProduct(response.data)
                setProductSelected(-1)
            }else{setProduct([]), setProductSelected(-1) }
        }
        loadProducts();
    },[categorySelected])

    async function handleCloseOrder(){
        try {
            await api.delete('/order', {
                params:{
                    order_id: order_id
                }
            })
            Router.push('/order')
        } catch (error) {
            console.log("erro:", error);
            Router.push('/order')
        }
    }

    function handleChangeCategory(e){
        // console.log("posição da categoria selecionada", e.target.value);
        // console.log("categoria selecionada", category[e.target.value]);
        setCategorySelected(e.target.value)
    }

    function handleChangeProduct(e){      
        setProductSelected(e.target.value)
    }

    async function handleAdd(){
        try {
            const response = await api.post('/order/add',{
                order_id: order_id,
                product_id: product[productSelected].id,
                amount: Number(amount)
            })
    
            let data = {
                id: response.data.id,
                product_id: product[productSelected].id as string,
                name: product[productSelected].name as string,
                amount: amount
            }
            setItems(oldArray => [...oldArray, data])
        } catch (error) {
            console.log("error:", error);
            Router.push('/order')
            toast.warn("Por favor, tente novamente")
        }

    }

    async function handleDeleteItem(item_id: string){
        const response = await api.delete('/order/delete',{
            params:{
                item_id: item_id
            }
        })
        //apos remover de api, remover da lista
        let removeItems = items.filter(item => {
            return(item.id !== item_id)
        })
        setItems(removeItems)
    }

    async function handleFinishOrder(){
        try {
            await api.put('/order/send', {
                order_id: order_id
            })
            socket?.emit('message')
            Router.push("/dashboard")

        } catch (error) {
            console.log("error:", error);
            Router.push('/order')
            toast.warn("Por favor, tente novamente")
            
        }
    }
    function handleModalOrder(){
        setModalVisible(true)
    }

    function handleCloseModal(){
        setModalVisible(false)
    }

    Modal.setAppElement('#__next');
    return(
        <>
            <Head>
                <title>Novo pedido - Pizzaria</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Mesa {route.query?.table}</h2>
                    {items.length === 0 && (
                        <button onClick={handleCloseOrder}>
                            <FiTrash2 size={28} color='#ff3f4b'/>
                        </button>
                    )}
                </div>

                    <select 
                    className={styles.input} 
                    value={categorySelected} 
                    onChange={handleChangeCategory}
                    style={{color: categorySelected != -1 ? '#fff' : '#757575'}}
                    >
                        <option style={{color: '#fff'}} value={-1} >Selecione uma categoria</option>
                            {category?.map((item:ProductProps, index:number)=>{
                                return(
                                    <option key={item.id} value={index} style={{color: '#fff'}}>
                                        {item.name}
                                    </option>
                                )
                            })}
                    </select>

                    <select 
                    className={styles.input} 
                    value={productSelected} 
                    onChange={handleChangeProduct} 
                    disabled={categorySelected == -1}
                    style={{color: productSelected != -1 ? '#fff' : '#757575'}}
                    >
                    <option style={{color: '#fff'}} value={-1} >Selecione um produto</option>
                        {product?.map((item:ProductProps, index:number)=>{
                                return(
                                    <option key={item.id} value={index} style={{color: '#fff'}}>
                                        {item?.name}
                                    </option>
                                )
                            })}
                    </select>


                <div className={styles.qtdContainer}>
                    <p className={styles.qtdText}>Quantidade</p>
                    <input
                    className={styles.input}
                    style={{ width: '60%', textAlign: 'center', border: 'none'}}
                    placeholder='1'
                    type='number'
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <button 
                    className={styles.buttonAdd} 
                    onClick={handleAdd} 
                    disabled={productSelected == -1 || categorySelected == -1}
                    style={{opacity: productSelected == -1 ? 0.3 : 1}}
                    >
                        <p className={styles.buttonText}>+</p>
                    </button>
                    <button 
                    className={styles.button}
                    style={{opacity: items.length === 0 ? 0.3 : 1}}
                    disabled={items.length === 0}
                    onClick={handleModalOrder}
                    >
                        <p className={styles.buttonText}>Avançar</p>
                    </button>
                </div>

                <div style={{ marginTop: 24}} className={styles.divItems}>
                    {items.map((item)=>{
                        return(
                            <ListItem key={item.id} data={item} deleteItem={handleDeleteItem}/>
                        )
                    })}
                </div>
            </main>
        {modalVisible && 
          <ModalFinish
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          info={{order_id: order_id, table: table}}
          finishOrder={handleFinishOrder}
          />
        }
        </>

    )
}

