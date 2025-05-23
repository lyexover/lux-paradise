'use client'

import styles from '@/app/modules/auth.module.css'
import { useActionState } from 'react'
import { login } from '@/lib/actions'

export default function Auth() {
    // The state will contain the error message returned from the action
    const [state, action, pending] = useActionState(login, undefined)

    return (
        <div className={styles.wrapper} >
            <form className={styles.form} action={action} >
                <h1>Connexion Admin</h1>
                {/* Display error message if it exists */}
                {state && <p className={styles.error}>{state}</p>}
                <label htmlFor="password"></label>
                <input id='password' type="password" name='password' placeholder="Mot de passe" />
                
                
                
                <button type='submit' >{pending ? 'Traitement' : 'Se connecter'}</button>
            </form>
        </div>
    )
}