import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import { Header } from "../../components/Header";

import { canSSRAuth } from '../../utils/canSSRAuth'

import { FiUpload } from 'react-icons/fi'

import { setupApiClient } from "../../services/api";

import { toast } from 'react-toastify'


type ItemProps = {
    id:string,
    name:string
}

interface CategoryProps{
    categoryList: ItemProps[],
}

export default function Product({categoryList}: CategoryProps){

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [avatarUrl, setAvatarUrl] = useState('')
    const [imgAvatar, setImgAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    useEffect(()=>{
        const selectColor = document.querySelector<HTMLElement>(".select")
        if(categorySelected != 0){
            selectColor.style.color = 'white'
        }else{
            selectColor.style.color = '#757575'
        }
    }, [categorySelected])

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImgAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }else{
            return;
        }
    }

    function handleChangeCategory(e){
        console.log("posição da categoria selecionada", e.target.value);
        console.log("categoria selecionada", categories[e.target.value]);
        setCategorySelected(e.target.value)
    }

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try {
            const data = new FormData()

            if(name === '' || price === '' || description === '' || imgAvatar === null || categorySelected == 0){     
                toast.error("Preencha todos os campos!")
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imgAvatar);

            const apiClient = setupApiClient();

            await apiClient.post('/product', data);

            toast.success('Cadastrado com sucesso!');

        } catch (err) {
            console.log(err);
            toast.error("Erro ao cadastrar!")
        }

        setName('')
        setPrice('')
        setDescription('')
        setImgAvatar(null)
        setAvatarUrl('')
    }

    return(
        <>
            <Head>
                <title>Novo produto - Pizzaria</title>
            </Head>
            <div>
                <Header/>
                <main className={styles.container}>
                    <h1>Novo produto</h1>
                    <form className={styles.form} onSubmit={handleRegister}>
                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#FFF"/>
                            </span>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />
                            {avatarUrl && (
                                <img 
                                className={styles.preview}
                                src={avatarUrl} 
                                alt="Foto do produto"
                                width={250}
                                height={250} 
                                />
                            )}
                        </label>
                        <select className="select" value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index)=>{
                                return(
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>
                        <input type="text" placeholder="Digite o nome do produto" className={styles.input} value={name} onChange={(e)=>setName(e.target.value)}/>
                        <input type="text" placeholder="Preço do produto" className={styles.input} value={price} onChange={(e)=>setPrice(e.target.value)} />
                        <textarea placeholder="Descreva seu produto..." className={styles.input} value={description} onChange={(e)=>setDescription(e.target.value)} />
                        <button type="submit">Cadastrar</button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const apiClient = setupApiClient(ctx)

    const response = await apiClient.get('/category')
    
    return{
        props:{
            categoryList: response.data
        }
    }
})