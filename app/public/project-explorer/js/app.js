let path = window.location.href;
let signupForm = document.querySelector('#signupForm');
let program = document.querySelector("#program");
let graduationYear = document.querySelector("#graduationYear");


let asyncHandler = async function(url){

    let response = await fetch(url);
    if(response.status != 200){
        throw new Error("something went wrong!!!");
    }
    let data = await response.json();
    return data;
    

}

window.onload = function(){

    if(path.includes("index.html") || path.includes("viewproject.html") || path.includes("createproject.html") || path.includes("editproject.html") || path.includes("profile.html") || path.includes("search.html")){

        let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

        // console.log(cookie);
        if(cookie.length > 0){ // If a cookie still exists or was erased (because the name/key would still be there)

            let cookieValue = cookie[0].trim().slice(4);

            if(cookieValue != ''){
                asyncHandler(`/api/users/${cookieValue}`)
                .then(data => {

                    let greeting = `Hi, ${data.firstname}`;

                    document.querySelector('#signUpLink').style.display = "none";
                    document.querySelector('#loginLink').style.display = "none";

                    document.querySelector('#username').innerHTML = greeting;

                    document.querySelector('#username').style.display = "block";
                    document.querySelector('#logout').style.display = "block";

                })
            }
        }


    }

    if(path.includes("register.html")){

        asyncHandler('/api/programs').then(data => {

            data.forEach(item => program.innerHTML += `<option value="${item}">${item}</option>`)

        }).catch(err => console.log(err.message))

        asyncHandler('/api/graduationYears').then(data => {
        
            data.forEach(item => graduationYear.innerHTML += `<option value="${item}">${item}</option>`)

        }).catch(err => console.log(err.message))
    }

    if(path.includes("index.html")){

        let showcase = document.querySelector('.showcase');
        // console.log(showcase);

        asyncHandler('/api/projects')
        .then(data => {
                
            data.forEach((item, index) => {

                if(index <= 3){

                    showcase.innerHTML += `<section class="card">
                    <a href="viewproject.html?id=${item.id}"><h4 class="card-title text-primary">${item.name}</h4></a>
                    <div class="card-subtitle text-secondary">${item.authors.join(' ')}
                    <div class="card-text">${item.abstract}</div>
                    <div class="text-primary"><p>${item.tags.join('')}</p></div>
                    </section>`;

                }

            });
          

        });


    }

    if(path.includes("createproject.html")){
        
        let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

        if(cookie.length > 0){ // If a cookie still exists or was erased (because the name/key would still be there)

            let cookieValue = cookie[0].trim().slice(4);

            if(cookieValue == ''){
                window.location.href = "/project-explorer/login.html"; // Redirect to login.html
            }
        }else{
            window.location.href = "/project-explorer/login.html"; // Redirect to login.html
        }

    }

    if(path.includes("viewproject.html")){

        let queryString = decodeURIComponent(window.location.search);

        let projectId = queryString.slice(4);

        asyncHandler(`/api/projects/${projectId}`)
        .then(data => {
 
            console.log(data.createdBy);
            document.querySelector("#project_name").innerHTML = data.name;
            document.querySelector("#project_abstract").innerHTML = data.abstract;
            data.authors.forEach((author,index) => {

                if(index == data.authors.length - 1){
                    document.querySelector("#project_authors").innerHTML += `<div>${author}</div>`;
                }else{
                    document.querySelector("#project_authors").innerHTML += `<div>${author}</div><hr/>`;
                }

            });

            document.querySelector('#project_tags').innerHTML = data.tags.join('');
            
            asyncHandler(`/api/users/${data.createdBy}`)
            .then(data => {
                console.log(data)
                document.querySelector("#project_author").innerHTML = `${data.firstname} ${data.lastname}`;
            })

        });
        

    }
}


if(path.includes("register.html")){

    
    signupForm.addEventListener('submit', function(e){

        e.preventDefault();
        let data = {
            firstname: signupForm.firstName.value,
            lastname: signupForm.lastName.value,
            email: signupForm.email.value,
            password: signupForm.password.value,
            matricNumber: signupForm.matricNumber.value,
            program: signupForm.program.value,
            graduationYear: signupForm.graduationYear.value
        }

        data = JSON.stringify(data);

        let registerUser = async function(url, userData){

            let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: userData
            });
                if(response.status != 200){
                    let errorsFromServer = true;
                    let serverData = await response.json();
                    return {errorsFromServer, serverData}
                }else{
                    let errorsFromServer = false;
                    let serverData = await response.json();
                    return {errorsFromServer, serverData}
                } 
        
        }

        registerUser('/api/register', data)
        .then(({errorsFromServer, serverData}) => {
            if(errorsFromServer){
                // console.log('We got some errors');
                // console.log(serverData.errors)
                document.querySelector('#alertErrors').style.display = "block";
                serverData.errors.forEach(error => {
                    document.querySelector('#alertErrors').innerHTML += `<div>${error}</div>`
                })
            }else{
                let name = "uid";
                let value = serverData.data.id;
                let maxAge = 60 * 60 * 24 * 100;

                document.cookie = `${name}=${value};path=/;max-age=${maxAge};`;
                window.location.href = "http://localhost:4000/project-explorer/index.html"
                
            }
        })
        .catch(err => console.log(err))

       

    })
    

}

if(path.includes("login.html")){

    let loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', function(e){

        e.preventDefault();
        let data = {

            email: loginForm.email.value,
            password: loginForm.password.value
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
                if(response.status != 200){
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
                window.location.href = "http://localhost:4000/project-explorer/index.html"
                
            }
        })
        .catch(err => console.log(err))


    });
    

}

if(path.includes("index.html") || path.includes("viewproject.html") || path.includes("createproject.html") || path.includes("editproject.html") || path.includes("profile.html") || path.includes("search.html")){
    let logout = document.querySelector('#logout');

    logout.addEventListener('click', function(e){

        e.preventDefault();
        document.cookie = `uid=;path=/;expires=Thu, 01 Jan 1970T00:00:00Z;`;
        window.location.href = "http://localhost:4000/project-explorer/index.html"

    });

    // console.log(logout, logout.innerHTML);
}

if(path.includes("createproject.html")){

    let createProjectForm = document.querySelector('#createProjectForm');

    createProjectForm.addEventListener('submit', function(e){

        e.preventDefault();

        let authorsArr = createProjectForm.authors.value.trim().split(',');
        authorsArr = authorsArr.map(author => author.trim());

        let regex = /(#\w+\b)/g;
        let tagsArr = [ ...createProjectForm.tags.value.matchAll(regex) ];
        tagsArr = tagsArr.map(tagArr => tagArr[0]);

        let data = {

            name: createProjectForm.name.value,
            abstract: createProjectForm.abstract.value,
            authors: authorsArr,
            tags: tagsArr,
           
        }

        data = JSON.stringify(data);
        // console.log(data);

        let sendProjectData = async function(url, userData){

            let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: userData
            });
                if(response.status != 200){
                    let errorsFromServer = true;
                    let serverData = await response.json();
                    return {errorsFromServer, serverData}
                }else{
                    let errorsFromServer = false;
                    let serverData = await response.json();
                    return {errorsFromServer, serverData}
                } 
        
        }

        sendProjectData('/api/projects', data)
        .then(({errorsFromServer, serverData}) => {
            if(errorsFromServer){

                document.querySelector('#alertErrors').style.display = "block";
                serverData.errors.forEach(error => {
                    document.querySelector('#alertErrors').innerHTML += `<div>${error}</div>`
                })
                
            }else{

                window.location.href = "http://localhost:4000/project-explorer/index.html"
                
            }
        })
        .catch(err => console.log(err))


    });


}