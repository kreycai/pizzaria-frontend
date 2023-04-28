import { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss'
import { toast } from 'react-toastify'
import { api } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";

export default function Category() {
    const [name, setName] = useState('')

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        if(name === ''){
            return;
        }

        await api.post('/category',{
            name: name
        })

        toast.success("Categoria cadastrada com sucesso!")
    }

  return (
    <>
      <Head>
        <title>Nova categoria - Pizzaria</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
            <h1>Cadastrar categorias</h1>
            <form className={styles.form} onSubmit={handleRegister}>
                <input 
                type="text"
                placeholder="Digite o nome da categoria"
                className={styles.input} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">
                    Cadastrar
                </button>
            </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props:{}
    }
})
