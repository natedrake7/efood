export async function GetProfessionalUsers(AccessToken)
{
    try{
        const response = await fetch('http://192.168.1.16:3000/professionaluser/get',
        {method:'GET',headers:
            new Headers({
                'Authorization': `Bearer ${AccessToken}`
            })
        });
        const resData = await response.json();
        return resData;
    }
    catch(error)
    {
        throw new Error(error);
    }
}