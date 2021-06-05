import React, { useState } from 'react';
import Layout from './shared/Layout';
import { useHistory } from 'react-router-dom';


const CreateProject = () => {

    const history = useHistory();
    const [projectName, setProjectName] = useState('');
    const [abstract, setAbstract] = useState('');
    const [authors, setAuthors] = useState('');
    const [tags, setTags] = useState('');

    let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

    if (cookie.length > 0) { // If a cookie still exists or was erased (because the name/key would still be there)

        let cookieValue = cookie[0].trim().slice(4);

        if (cookieValue === '') {
            history.push('/login'); // Redirect to login.html
        }

    } else {
        history.push('/login'); // Redirect to login.html
    }

    const handleChange = (e) => {

        if(e.target.name === "name"){
            setProjectName(e.target.value);
        }

        if(e.target.name === "abstract"){
            setAbstract(e.target.value);
        }

        if(e.target.name === "authors"){
            setAuthors(e.target.value);
        }

        if(e.target.name === "tags"){
            setTags(e.target.value);
        }

    }

    const createProject = (e) => {
        e.preventDefault();

            let authorsArr = authors.trim().split(',');
            authorsArr = authorsArr.map(author => author.trim());

            let regex = /(#\w+\b)/g;
            let tagsArr = [ ...tags.matchAll(regex) ];
            tagsArr = tagsArr.map(tagArr => tagArr[0]);


            let data = {

                name: projectName,
                abstract,
                authors: authorsArr,
                tags: tagsArr,

            }

            data = JSON.stringify(data);
            console.log(data);

            let sendProjectData = async function (url, userData) {

                let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: userData
                });
                if (response.status !== 200) {
                    let errorsFromServer = true;
                    let serverData = await response.json();
                    return { errorsFromServer, serverData }
                } else {
                    let errorsFromServer = false;
                    let serverData = await response.json();
                    return { errorsFromServer, serverData }
                }

            }

            sendProjectData('/api/projects', data)
                .then(({ errorsFromServer, serverData }) => {
                    if (errorsFromServer) {

                        console.log(errorsFromServer, serverData)
                        document.querySelector('#alertErrors').style.display = "block";
                        serverData.errors.forEach(error => {
                            document.querySelector('#alertErrors').innerHTML = `<div>${error}</div>`
                        })

                    } else {

                        history.push("/");

                    }
                })
                .catch(err => console.log(err))

    

    }


    return (

        <Layout>

            <main>
                <div className="alert alert-danger" id="alertErrors" style={{display: "none"}} role="alert">

                </div>

                <form id="createProjectForm" onSubmit={createProject} className="mx-auto w-75 mt-5" name="submitProject" action="" method="get" acceptCharset="utf-8">

                    <h1>Submit Project</h1>

                    <div className="form-group">

                        <label htmlFor="projectName">Project Name</label>
                        <input onChange={handleChange} className="form-control" type="text" name="name" id="projectName" placeholder="Enter project name" value={projectName} />

                    </div>

                    <div className="form-group">

                        <label htmlFor="projectAbstract">Project Abstract</label>
                        <textarea onChange={handleChange} className="form-control" name="abstract" id="projectAbstract" rows="10" value={abstract}></textarea>

                    </div>

                    <div className="form-group">

                        <label htmlFor="authors">Authors</label>
                        <input onChange={handleChange} className="form-control" type="text" name="authors" id="authors" placeholder="Enter author names (separated by comma)" value={authors} />

                    </div>

                    <div className="form-group">

                        <label htmlFor="tags">Tag(s)</label>
                        <input onChange={handleChange} className="form-control" type="text" name="tags" id="tags" placeholder="Use # to tag project with different topics (e.g. #javascript #mongodb)" value={tags} />

                    </div>

                    <button className='btn btn-primary' type='submit'>Continue</button>
                </form>

            </main>

        </Layout>

    )

}


export default CreateProject;