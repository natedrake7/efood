import Config from 'react-native-config';
import { AuthContext } from './auth-context';
import { useContext } from 'react';

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