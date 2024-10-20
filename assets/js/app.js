const cl = console.log;

const postsContainer = document.getElementById("postsContainer");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const postsForm = document.getElementById("postsForm");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");

let BASE_URL = `https://jsonplaceholder.typicode.com`;

let POST_URL = `${BASE_URL}/posts`;

const onDelete = (eve) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this post!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let getId = eve.closest('.card').id;
            let deleteUrl = `${BASE_URL}/posts/${getId}`;
            let xhr = new XMLHttpRequest();

            xhr.open("DELETE", deleteUrl);

            xhr.send();

            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
                    eve.closest('.card').remove();
                }
            }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}

const onEdit = (eve) => {
    let getId = eve.closest('.card').id;
    localStorage.setItem("getId", getId);
    let editurl = `${BASE_URL}/posts/${getId}`;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", editurl);

    xhr.send();

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            title.value = data.title;
            body.value = data.body;
            userId.value = data.userId;

            let getScrollValue = window.scrollY;
            if(getScrollValue >= 100){
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
            addBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
        }
    }
}

let result = ``;
const createPostsCards = (array) => {
    for(let i = 0;  i < array.length; i++){
    result += `
                  <div class="card mt-4" id="${array[i].id}">
                    <div class="card-header text-capitalize">
                        <h4>${array[i].title}</h4>
                    </div>
                    <div class="card-body text-capitalize">
                        <p>${array[i].body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                  </div>
              `
              postsContainer.innerHTML = result;
    }
}

const fetchPostsCards = () => {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", POST_URL);

    xhr.send();

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);
            createPostsCards(data);
        }
    }
}

fetchPostsCards();


const onSubmitBtn = (eve) => {
    eve.preventDefault();
    let obj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", POST_URL);
    xhr.send(JSON.stringify(obj));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let data = JSON.parse(xhr.response);

            let div = document.createElement("div");
            div.className = 'card mt-4';
            div.id = data.id;
            div.innerHTML = `
                            <div class="card-header text-capitalize">
                                <h4>${obj.title}</h4>
                            </div>
                            <div class="card-body text-capitalize">
                                <p>${obj.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
            `
            postsContainer.prepend(div);
        }
    }
    postsForm.reset();
    Swal.fire({
        title : 'New Post Added Successfully !!!',
        icon : 'success',
        timer : 2000
    })
}

const onUpdateClick = (eve) => {
    let getId = localStorage.getItem('getId');
    let updateUrl = `${BASE_URL}/posts/${getId}`;
    let obj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", updateUrl);

    xhr.send(JSON.stringify(obj));

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299 && xhr.readyState === 4){
            let card = [...document.getElementById(getId).children];
            card[0].innerHTML = `<h4>${obj.title}</h4>`;
            card[1].innerHTML = `<p>${obj.body}</p>`;
        }
    }
    postsForm.reset();
    Swal.fire({
        title : 'Post updated Successfully !!!',
        icon : 'success',
        timer : 2000
    });
}

postsForm.addEventListener("submit", onSubmitBtn);
updateBtn.addEventListener("click", onUpdateClick);

