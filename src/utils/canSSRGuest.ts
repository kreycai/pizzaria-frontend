import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from 'nookies';

//funcao para paginas que só podem ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>>=>{
        //se tentar acessar a pagina porem tendo ja feito um login salvo redirecionamos
        const cookies = parseCookies(ctx)
        if(cookies['@nextauth.token']){
            return{
                redirect:{
                    destination:'/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(ctx);
    }
}