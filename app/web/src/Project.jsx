import React, { useEffect, useState } from 'react';
import Layout from './shared/Layout';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';


const Project = (props) => {

    const [comment, setComment] = useState('Leave a comment');
    const [projectName, setProjectName] = useState('');
    const [abstract, setAbstract] = useState('');
    const [creator, setCreator] = useState('');
    const [authors, setAuthors] = useState([]);
    const [tags, setTags] = useState([]);
    const params = useParams();
    const history = useHistory();

    useEffect(() => {

        let asyncHandler = async function (url) {

            let response = await fetch(url);
            if (response.status !== 200) {
                throw new Error("something went wrong!!!");
            }
            let data = await response.json();
            return data;
        
        
        }

        let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

        if (cookie.length > 0) { // If a cookie still exists or was erased (because the name/key would still be there)

            let cookieValue = cookie[0].trim().slice(4);

            if (cookieValue === '') {
                history.push('/login'); // Redirect to login.html
            }else{
                
            }
        } else {
            history.push('/login'); // Redirect to login.html
        }

        console.log('hello');

        asyncHandler(`/api/projects/${params.id}`)
                    .then(data => {

                        console.log(data);
                        setProjectName(prevName => data.name);
                        setAbstract(data.abstract);
                        setAuthors(data.authors);
                        setTags(data.tags);

                        asyncHandler(`/api/users/${data.createdBy}`)
                            .then(data => {
                                console.log(data);
                                setCreator(`${data.firstname} ${data.lastname}`)
                                // document.querySelector("#project_author").innerHTML = `${data.firstname} ${data.lastname}`;
                        })
                        
                        // console.log('PROJECT NAME: ', projectName);
                        // console.log('PROJECT ABSTRACT: ', abstract);
                        // console.log('PROJECT AUTHORS: ', authors);
                        // console.log('PROJECT TAGS: ', comment);
                        // console.log('In the then function');

                    })
                    .catch(err => {console.log(err)});


    }, []);

    const handleChange = () => { };



    return (

        <Layout>

            <main className="container mt-4">

                <section>

                    <h1 id="project_name">{projectName}</h1>

                    <div className="row bg-light pt-3 pl-2 pr-2">

                        <div className="col">Created By</div>
                        <div className="col">Date Created</div>
                        <div className="col">Last Updated</div>
                        <div className="col d-flex justify-content-end"><a href="editproject.html" className="btn btn-primary">Edit Project</a></div>

                    </div>


                    <div className="row bg-light pb-3 pl-2 pr-2">

                        <div className="col" id="project_author">{creator}</div>
                        <div className="col">2020-08-30</div>
                        <div className="col">2020-08-30</div>
                        <div className="col"></div>

                    </div>

                </section>
                <section>
                    <div className="row mb-5">

                        <div className="col-sm-12 col-md-6">

                            <div className="card mb-4" style={{ border: "none" }}>

                                <div className="card-header" style={{ backgroundColor: "white" }}>

                                    <h3>Project Abstract</h3>

                                </div>

                                <div className="card-body" style={{ textAlign: "justify" }}>

                                    <div className="mb-3" id="project_abstract">
                                        {abstract}
                                    </div>

                                    <Form name="projectComments" action="" method="get" acceptCharset="utf-8">

                                        <h3>Comments</h3>

                                        <Form.Group>

                                            <Form.Label>Leave a comment</Form.Label>
                                            <Form.Control as="textarea" rows={3} onChange={handleChange} name="comments" id="projectName" value={comment} />

                                        </Form.Group>

                                        <Button variant="primary" type="submit">Submit</Button>

                                    </Form>


                                </div>

                                <div className="card-footer" style={{ backgroundColor: "white !important", textAlign: "center" }}>No comments added yet</div>

                            </div>



                        </div>

                        <div className="col-sm-12 col-md-6">

                            <div className="card mb-4" style={{ border: "none" }}>

                                <div className="card-header" style={{ backgroundColor: "white" }}>

                                    <h3>Project Details</h3>

                                </div>


                            </div>

                            <div className="card">

                                <div className="card-header" style={{ fontWeight: "bold" }}>Author(s)</div>
                                <div className="card-body" id="project_authors">
                                    {authors.map((author, index) => index === authors.length - 1? <div key={index}>{author}</div>:<div key={index}>{author}<hr/></div>)}
                                </div>
                                <div className="card-footer text-primary" id="project_tags">
                                {tags}
                                </div>

                            </div>


                            <div className="card mt-3">

                                <div className="card-header" style={{ fontWeight: "bold" }}>Project files</div>
                                <div className="card-body" style={{ textAlign: 'center' }}>No file uploaded yet</div>

                            </div>

                        </div>



                    </div>
                </section>

            </main>

        </Layout>

    )

}


export default Project;
