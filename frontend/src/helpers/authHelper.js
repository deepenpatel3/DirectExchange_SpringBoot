import firebase from 'firebase';
export const logout = async () =>{
    await firebase.auth().signOut();
    localStorage.removeItem("id");
    localStorage.removeItem("uid");
    localStorage.removeItem("nickname");
    localStorage.removeItem("username");
} 

export const login = (user) =>{
    localStorage.setItem("id" , user.id);
    localStorage.setItem("uid" , user.uid);
    localStorage.setItem("nickname" , user.nickname);
    localStorage.setItem("username" , user.username);
}

export const getloggedInUser = () =>{
    if(localStorage.getItem("id")){
        let user = {
            id : localStorage.getItem("id"),
            uid : localStorage.removeItem("uid"),
            nickname : localStorage.removeItem("nickname"),
            username : localStorage.removeItem("username")
        }
    
        return user;
    }
    return null;
}