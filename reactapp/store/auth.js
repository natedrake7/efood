export async function Register(data){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/create',{method:'POST',body:data});
        const resData = await response.json();

        if(!response.ok)
            return resData.errors;

        return resData;
    }
    catch(error)
    {
        throw new Error(error);
    }
};

export async function LogIn(data){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/signin',{method:'POST',body:data});
        const resData = await response.json();

        if(!response.ok)
            return resData.errors;

        return resData;
    }
    catch(error)
    {
        throw new Error(error);
    }
};

export async function GetToken(refreshToken){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/refresh',{method:'POST',headers:
                                                                                new Headers({
                                                                                    'Authorization': `Bearer ${refreshToken}`
                                                                                })
                                                                                });
        const resData = await response.json();

        if(!response.ok)
            throw new Error("Failed to fetch Access token!");

        return resData.accesstoken;
    }
    catch(error)
    {
        console.log(error);
    }
}