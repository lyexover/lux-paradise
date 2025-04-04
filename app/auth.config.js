export const authConfig= {
    pages : {
        signIn : '/admin'
    }, 
    callbacks : {
        authorized({auth, request : {nextUrl}}){
            const isLogged = !!auth?.user
            const isInDashboard = nextUrl.pathname.startsWith('/dashboard')

            if(isInDashboard){
                if(isLogged){
                    return true
                }
                return false
            }

            
            return true
            
        }
    } , 
    providers: []
}