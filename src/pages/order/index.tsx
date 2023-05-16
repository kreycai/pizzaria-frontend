import React, { useContext, useState } from "react"
import styles from './styles.module.scss';
import { AuthContext } from "../../contexts/AuthContext"
import Head from "next/head";
import { Header } from "../../components/Header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Router from "next/router";
import { setupApiClient } from "../../services/api";

type QueryParams = {
    order_id: string;
    table:  string;
}

export default function Order(){
    const { signOut } = useContext(AuthContext);
    const api = setupApiClient();

    const [number, setNumber] = useState('')

    async function openOrder(){
        if(number === ''){
            return;
        }

        const response = await api.post('/order',{
            table: Number(number)
        })
        
        // navigation.navigate('Order', {order_id: response.data.id , number: number})
        Router.push({pathname: '/orderItem', query: {order_id: response.data.id, table: number} as QueryParams}, '/orderItem')


        setNumber('')
    }

    return(
        <>
            <Head>
                <title>Novo produto - Pizzaria</title>
            </Head>
            <Header/>
            <main className={styles.container}>
                <h2 className={styles.title} >Novo pedido</h2>

                <input
                className={styles.input}
                placeholder="Numero da mesa"
                type="number"
                value={number}
                onChange={(e)=>setNumber(e.target.value)}
                />
                
                <button className={styles.button} onClick={openOrder}>
                    <p className={styles.buttonText}>Abrir mesa</p>
                </button>
            </main>
        </>

    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
      props: {}
    };
  });
  