'use server'

import { signIn } from '../auth'    
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'


export async function login(currentState, formData){
    const password = formData.get('password')

    try{
        await signIn('credentials', {
            password,
            redirect: false
        })
    
        redirect('/dashboard')
    }
    catch(err){
        if(err instanceof AuthError){
            switch(err.type){
                case 'CredentialsSignin':
                    return 'Invalid credentials'
                default:
                    return 'Something went wrong'
            }
        }
        throw err
    }

   
}