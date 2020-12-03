import firebase from 'firebase';
export const logout = async () => {
    await firebase.auth().signOut();
    localStorage.removeItem("id");
    localStorage.removeItem("uid");
    localStorage.removeItem("nickname");
    localStorage.removeItem("username");
}

export const login = (user) => {
    console.log("user ", user);
    localStorage.setItem("id", user.id);
    localStorage.setItem("uid", user.uid);
    localStorage.setItem("nickname", user.nickname);
    localStorage.setItem("username", user.username);
}

export const getloggedInUser = () => {
    if (localStorage.getItem("id")) {
        let user = {
            id: localStorage.getItem("id"),
            uid: localStorage.getItem("uid"),
            nickname: localStorage.getItem("nickname"),
            username: localStorage.getItem("username")
        }

        return user;
    }
    return null;
}