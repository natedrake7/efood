export async function GetProfessionalUsers(AccessToken)
{
    try{
        const response = await fetch('http://192.168.1.16:3000/professionaluser/get',
        {method:'GET',headers:
            new Headers({
                'Authorization': `Bearer ${AccessToken}`
            })
        });
       return await response.json();
    }
    catch(error)
    {
        throw new Error(error);
    }
}

export async function GetProfessionalUserById(AccessToken,id)
{
    try{
        const response = await fetch(`http://192.168.1.16:3000/professionaluser/get/${id}`,
        {method:'GET',headers:
            new Headers({
                'Authorization': `Bearer ${AccessToken}`
            })
        });
        return await response.json();
    }
    catch(error)
    {
        throw new Error(error);
    }
}