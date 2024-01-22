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
};

export async function EditPassword(data,accessToken){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/edit/password',{method:'POST',headers:
                                                                                        new Headers({
                                                                                            'Authorization': `Bearer ${accessToken}`
                                                                                        }),
                                                                                        body:data,
                                                                                        });
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
};

export async function EditProfile(data,accessToken){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/edit',{method:'POST',headers:
                                                                            new Headers({
                                                                                'Authorization': `Bearer ${accessToken}`
                                                                            }),
                                                                            body:data,
                                                                            });
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export async function GetUserAdresses(accessToken){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/address/get',{method:'GET',headers:
        new Headers({
            'Authorization': `Bearer ${accessToken}`
        })});

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export async function DeleteUserAddress(accessToken,id){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/address/delete/' + id,{method:'POST',headers:
                                                                            new Headers({
                                                                                'Authorization': `Bearer ${accessToken}`
                                                                            })});
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export async function CreateAddress(data,accessToken){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/address/create',{method:'POST',headers:
                                                                            new Headers({
                                                                                'Authorization': `Bearer ${accessToken}`
                                                                            }),
                                                                            body:data,
                                                                            });
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export async function GetAddressById(accessToken,id){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/address/get/' + id,{method:'GET',headers:
                                                                            new Headers({
                                                                                'Authorization': `Bearer ${accessToken}`
                                                                            })});
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }   
}

export async function EditAddress(accessToken,data,id){
    try{
        const response = await fetch('http://192.168.1.16:3000/user/address/edit/' + id,{method:'POST',headers:
                                                                            new Headers({
                                                                                'Authorization': `Bearer ${accessToken}`
                                                                            }),
                                                                            body:data,
                                                                            });
        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    } 
}