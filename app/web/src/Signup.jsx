import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Layout from './shared/Layout';
import {Form, Button, Col} from 'react-bootstrap';

let asyncHandler = async function(url){

    let response = await fetch(url);
    if(response.status !== 200){
        throw new Error("something went wrong!!!");
    }
    let data = await response.json();
    return data;
    

}

const Signup = (props) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [program, setProgram] = useState('Computer Science');
    const [matricNumber, setMatricNumber] = useState('');
    const [graduationYear, setGraduationYear] = useState('2015');
    const history = useHistory();
    
    window.onload = () => {

        let program = document.querySelector("#program");
        let graduationYear = document.querySelector("#graduationYear");

        asyncHandler('/api/programs').then(data => {

            data.forEach(item => program.innerHTML += `<option value="${item}">${item}</option>`);

        }).catch(err => console.log(err.message))

        asyncHandler('/api/graduationYears').then(data => {
        
            data.forEach(item => graduationYear.innerHTML += `<option value="${item}">${item}</option>`);

        }).catch(err => console.log(err.message))

    }
    
    const handleChange = (e) => {

        if(e.target.name === 'firstName'){
            setFirstName(e.target.value);
        }
        if(e.target.name === 'lastName'){
            setLastName(e.target.value);
        }
        if(e.target.name === 'email'){
            setEmail(e.target.value);
        }
        if(e.target.name === 'password'){
            setPassword(e.target.value);
        }
        if(e.target.name === 'program'){
            setProgram(e.target.value);
        }
        if(e.target.name === 'matricNumber'){
            setMatricNumber(e.target.value);
        }
        if(e.target.name === 'graduationYear'){
            setGraduationYear(e.target.value);
        }
        

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        let registerUser = async function(url, userData){

                let response = await fetch(url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: userData
                });
                    if(response.status !== 200){
                        let errorsFromServer = true;
                        let serverData = await response.json();
                        return {errorsFromServer, serverData}
                    }else{
                        let errorsFromServer = false;
                        let serverData = await response.json();
                        return {errorsFromServer, serverData}
                    } 
            
            }

            let data = {
                firstname: firstName, 
                lastname: lastName, 
                email, 
                password, 
                program, 
                matricNumber, 
                graduationYear
            }

            data = JSON.stringify(data);
            console.log(data);
    
            registerUser('/api/register', data)
            .then(({errorsFromServer, serverData}) => {
                if(errorsFromServer){
                    // console.log('We got some errors');
                    // console.log(serverData.errors)
                    document.querySelector('#alertErrors').style.display = "block";
                    serverData.errors.forEach(error => {
                        document.querySelector('#alertErrors').innerHTML = `<div>${error}</div>`
                    })
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
            
            <main className="mx-auto w-75" style={{marginTop: '120px'}}>
                <h1>Signup</h1>

                <div className="alert alert-danger" style={{display: 'none'}} id="alertErrors" role="alert">

                </div>
                <Form id="signupForm" onSubmit={handleSubmit} action="" method="POST" acceptCharset="utf-8">

                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control onChange={handleChange} type="text" name="firstName" id="firstName" value={firstName} placeholder="First name"/>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control onChange={handleChange} type="text" name="lastName" id="lastName" value={lastName} placeholder="Last name"/>
                        </Form.Group>

                    </Form.Row>

                    <Form.Row>

                        <Form.Group as={Col}>
                            <Form.Label>Email Address:</Form.Label>
                            <Form.Control onChange={handleChange} type="email" name="email" id="email" value={email} placeholder="Your Email Address"/>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={handleChange} type="password" name="password" id="password" value={password} placeholder="Your Password"/>
                        </Form.Group>

                    </Form.Row>

                    <Form.Row>

                        <Form.Group as={Col}>
                            <Form.Label>Program</Form.Label>
                            <Form.Control as="select" onChange={handleChange} name="program" value={program} id="program"/>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Matric Number</Form.Label>
                            <Form.Control onChange={handleChange} type="text" name="matricNumber" id="matricNumber" value={matricNumber} placeholder="e.g. 16/2020"/>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Graduation Year</Form.Label>
                            <Form.Control as="select" onChange={handleChange} name="graduationYear" value={graduationYear} id="graduationYear"/>
                        </Form.Group>

                    </Form.Row>
{/* 
                    <div className="form-row">

                        <div className="form-group col-md-6">

                            <label htmlFor="firstName">First Name:</label>
                            <input onChange={handleChange} className="form-control" type="text" name="firstName" id="firstName" value={firstName} placeholder="First name" />

                        </div>
                        {' '}
                        <div className="form-group col-md-6">

                            <label htmlFor="lastName">Last Name:</label>
                            <input onChange={handleChange} className="form-control" type="text" name="lastName" id="lastName" value={lastName} placeholder="Last name" />
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group col-md-6">

                            <label htmlFor="email">Email Address:</label>
                            <input onChange={handleChange} className="form-control" type="email" name="email" id="email" value={email} placeholder="Your Email Address" />

                        </div>


                        <div className="form-group col-md-6">

                            <label htmlFor="password">Password:</label>
                            <input onChange={handleChange} className="form-control" type="password" name="password" id="" value={password} placeholder="Your Password" />
                        </div>



                    </div>

                    <div className="form-row">

                        <div className="form-group col-md-6">

                            <label htmlFor="program">Program:</label>
                            <select onChange={handleChange} className="form-control" name="program" value={program} id="program">
                                
                            </select>

                        </div>

                        <div className="form-group col-md-3">

                            <label htmlFor="matricNumber">Matric Number</label>
                            <input onChange={handleChange} className="form-control" type="text" name="matricNumber" id="matricNumber" value={matricNumber} placeholder="e.g. 16/2020" />

                        </div>

                        <div className="form-group col-md-3">

                            <label htmlFor="graduationYear">GraduationYear:</label>
                            <select onChange={handleChange} className="form-control" name="graduationYear" value={graduationYear} id="graduationYear">
                            
                            </select>

                        </div>

                    </div> */}

                    <Button variant='primary' type="submit">sign up</Button>
                </Form>
            </main>

        </Layout>

    )


}




export default Signup;