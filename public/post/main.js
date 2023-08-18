 function createPost(event) {
  event.preventDefault();
  let postTitle = document.querySelector("#title");
  let postText = document.querySelector("#text");

  let timestamp = new Date().toISOString();


  axios.post(`/api/v1/post`, {
    title: postTitle.value,
    text: postText.value,
    timestamp: timestamp
  })
    .then(function (response) {
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Post Added',
        timer: 1000,
        showConfirmButton: false
      });
      renderPost();
    })
    .catch(function (error) {
      console.log("Error creating post:", error.data);
      document.querySelector(".result").innerHTML = "Error in post submission";
    });

  postTitle.value = "";
  postText.value = "";
}


function renderPost() {
  axios.get(`/api/v1/posts`)
    .then(function (response) {
      let posts = response.data;
      let postContainer = document.querySelector(".result");
      postContainer.innerHTML = "";

      posts.forEach(function (post) {
        let postElement = document.createElement("div");
        postElement.className = "post";

        let time = document.createElement("p");
        time.className = "regards center";
        time.style.fontSize = "0.7em";
        time.textContent = moment(post.timestamp).fromNow();
        postElement.appendChild(time);

        let titleElement = document.createElement("h2");
        titleElement.textContent = post.title;
        titleElement.className = "scroll";
        postElement.appendChild(titleElement);

        let textElement = document.createElement("p");
        textElement.className = "scroll";
        textElement.textContent = post.text;
        postElement.appendChild(textElement);
        postElement.dataset.postId = post.id;

        let row = document.createElement("div");
        row.className = "space-around";

        let regards = document.createElement("p");
        regards.className = "regards";
        regards.textContent = "Regards! Azain ansari";
        row.appendChild(regards);

        // Add edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function (event) {
          event.preventDefault();
          const postId = this.parentNode.parentNode.dataset.postId;
          editPost(postId);
        });
        row.appendChild(editButton);

        // Add delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function (event) {
          event.preventDefault();
          const postId = this.parentNode.parentNode.dataset.postId;
          deletePost(postId);
        });
        row.appendChild(deleteButton);

        postElement.appendChild(row);

        postContainer.appendChild(postElement);
      });
    })
    .catch(function (error) {
      console.log(error.data);
    });
}

function deletePost() {
  // Fetch the post ID from the clicked button's dataset
  const postId = event.target.parentNode.parentNode.dataset.postId;

  Swal.fire({
    icon: 'warning',
    title: 'Are you sure you want to delete this post?',
    showCancelButton: true,
    // ...
  }).then(result => {
    if (result.isConfirmed) {
      axios.delete(`/api/v1/post/${postId}`)
        .then(response => {
          // ...
        })
        .catch(error => {
          // ...
        });
    }
  });
}


function editPost(postId) {
  axios.get(`/api/v1/post/${postId}`)
    .then(response => {
      const post = response.data;
      Swal.fire({
        title: 'Edit Post',
        html: `
          <input type="text" id="editTitle" class="swal2-input" placeholder="Post Title" value="${post.title}" required>
          <textarea id="editText" class="swal2-input text" placeholder="Post Text" required>${post.text}</textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Edit',
        preConfirm: () => {
          const editedTitle = document.getElementById('editTitle').value;
          const editedText = document.getElementById('editText').value;

          if (!editedTitle.trim() || !editedText.trim()) {
            Swal.showValidationMessage('Title and text are required');
            return false;
          }

          axios.put(`/api/v1/post/${postId}`, {
            title: editedTitle,
            text: editedText
          })
            .then(response => {
              console.log(response.data);
              Swal.fire({
                icon: 'success',
                title: 'Post Updated',
                timer: 1000,
                showConfirmButton: false
              });
              renderPost(); // Render updated posts
            })
            .catch(error => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Failed to update post',
                timer: 1000,
                showConfirmButton: false
              });
            });
        }
      });
    })
    .catch(error => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch post',
        timer: 1000,
        showConfirmButton: false
      });
    });
}
// 


document.addEventListener("readystatechange", function () {
  if (document.readyState === "complete") {
    renderPost();
  }
});

function logout() {
  localStorage.removeItem('jwtToken');

  window.location.href = '../login/index.html'; // Redirect to the login page
}
