import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from './shared/Layout';
import {Form, Button} from 'react-bootstrap';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleChange = (e) => {

        if(e.target.name === 'email'){
            setEmail(e.target.value);
        }
        if(e.target.name === 'password'){
            setPassword(e.target.value);
        }

    }

    const handleSubmit = (e) => {

        e.preventDefault();
            let data =    {

                                password,
                                email

                            }

            data = JSON.stringify(data);

        let loginUser = async function(url, userData){

            let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: userData
            });
                if(response.status !== 200){
                    let errorsFromServer = true;
                    let serverData = undefined;
                    return {errorsFromServer, serverData}
                }else{
                    let errorsFromServer = false;
                    let serverData = await response.json();
                    return {errorsFromServer, serverData}
                } 
        
        }

        loginUser('/api/login', data)
        .then(({errorsFromServer, serverData}) => {
            if(errorsFromServer){

                document.querySelector('#alertErrors').innerHTML = `<div>Invalid email/password</div>`;
                document.querySelector('#alertErrors').style.display = "block";
                
            }else{
                let name = "uid";
                let value = serverData.data.id;
                let maxAge = 60 * 60 * 24 * 100;

                document.cookie = `${name}=${value};path=/;max-age=${maxAge};`;
                history.push('/');
                
            }
        })
        .catch(err => console.log(err))

    

    }
    
    return (

        <Layout>

            <main className="mx-auto w-50" style={{marginTop: "120px"}}>
                <h1 className="mb-5">Login</h1>

                <div className="alert alert-danger" style={{display: "none"}} id="alertErrors" role="alert">

                </div>

                <Form id="loginForm" onSubmit={handleSubmit} action="" method="POST" acceptCharset="utf-8">

                    <Form.Group>

                        <Form.Label>Email Address:</Form.Label>
                        <Form.Control onChange={handleChange} name="email" id="email" value={email} type="email" placeholder="Enter email"/>

                    </Form.Group>

                    <Form.Group className="mb-5">

                        <Form.Label>Password:</Form.Label>
                        <Form.Control onChange={handleChange} name="email" id="password" value={password} type="password" placeholder="Password"/>

                    </Form.Group>

                    <Button variant="primary" type="submit">login</Button>
                </Form>

            </main>


        </Layout>

    )

}


export default Login;