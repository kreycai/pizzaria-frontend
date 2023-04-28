import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import { AuthTokenError } from '@/services/errors/AuthTokenError';
import { api } from '@/services/apiClient';

//funcao para apenas users logados ter acesso.
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        //TESTA COMENTAR ISSO QND A PAGINA DASHBOARD TIVER FZND CHAMADA NA API E VE SE A PAGINA VAI PRA HOME SOZINHA
        //ATUALMENTE ANTES DO TESTE ELA É ACESSADA NORMAL(JA Q N FAZ CHAMADA NA API), MAS A API TA CONFIGURADA
        //PARA VER SE TA AUTORIZADO E REDIRECIONAR, VE C FUNFA ISSO
        if(!token){
            return{
                redirect:{
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try {
            return await fn(ctx);
        } catch (err) {
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@nextauth.token')
                return{
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}