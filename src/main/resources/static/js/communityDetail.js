const insertCommentBtn = document.getElementById("insertCommentBtn");


insertCommentBtn.addEventListener("click",insertComment);


async function insertComment(e) {
    e.preventDefault();
    const insertCommentSeq = document.getElementById("insertCommentSeq").value;
    const commentContent = document.getElementById("commentContent").value;
 
    await fetch('/community/comment/write',{
                method : 'POST',
                headers : {'content-Type' : 'application/json'},
                body : JSON.stringify({
                            content : commentContent,
                            postSeq : insertCommentSeq
                })
    })
    .then( (response) => {
            return response.text();
    })
    .then((data) => {
        window.location.href = 'http://localhost:8080/community/detail?communitySeq=' + insertCommentSeq ;
        alert(data);
    })
    .catch((error) => {
        alert("댓글 입력에 실패하였습니다");
    })
}

const toggleReplyForm = document.querySelectorAll(".toggleReplyForm");
const replyFormBox = document.querySelectorAll(".replyFormBox");

toggleReplyForm.forEach( (e,index) => {
    e.addEventListener("click",()=>{
        const box = replyFormBox[index];
        if(box.style.display === "none" || box.style.display === "") {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    })
})


const replyCommentParentSeq = document.querySelectorAll(".replyCommentParentSeq");              
const replyCommentPostSeq = document.querySelectorAll(".replyCommentPostSeq");          
const replyCommentContent = document.querySelectorAll(".replyCommentContent");            
const replyCommentBtn = document.querySelectorAll(".replyCommentBtn");             

replyCommentBtn.forEach((e,index) =>{
    e.addEventListener("click",()=>{
        insertReplyComment(e,index,replyCommentPostSeq,replyCommentContent,replyCommentParentSeq);
    })
})

async function insertReplyComment(e,index,replyCommentPostSeq,replyCommentContent,replyCommentParentSeq) {
    const parentSeq = replyCommentParentSeq[index].value;
    const content = replyCommentContent[index].value;
    const postSeq = replyCommentPostSeq[index].value;
    
    await fetch('/community/comment/write',{
        method : "POST",
        headers : {'content-Type' : 'application/json'},
        body : JSON.stringify({
            content : content,
            parentSeq : parentSeq,
            postSeq : postSeq
        })
    })
    .then((response) => {
        return response.text();
    })
    .then((data)=>{
        window.location.href = 'http://localhost:8080/community/detail?communitySeq=' + postSeq ;
        alert(data);
    })
    .catch((error)=>{
        alert("댓글중 오류")
    })
}

const toggleUpdateReplyForm = document.querySelectorAll(".toggleUpdateReplyForm");
const replyUpdateFormBox = document.querySelectorAll(".replyUpdateFormBox");

toggleUpdateReplyForm.forEach((e,index)=>{
    const box = replyUpdateFormBox[index];
    e.addEventListener("click",()=>{
        if(box.style.display === "none" || box.style.display === "") {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    })
})

const replyUpdateCommentBtn = document.querySelectorAll(".replyUpdateCommentBtn");
const replyUpdateCommentContent = document.querySelectorAll(".replyUpdateCommentContent");
const replyCommentSeq = document.querySelectorAll(".replyUpdateCommentParentSeq");
const replyUpdateCommentPostSeq = document.querySelectorAll(".replyUpdateCommentPostSeq");

replyUpdateCommentBtn.forEach((e,index)=>{
    e.addEventListener("click",()=>{
        const content = replyUpdateCommentContent[index].value;
        const seq = replyCommentSeq[index].value;
        const postSeq = replyUpdateCommentPostSeq[index].value;

        fetch("/community/comment/update/"+ seq,{
            method : "PUT",
            headers : {
                        "Content-type" : "application/json"
                    },
            body : JSON.stringify ({
                            content : content
                    })
        })
        .then((response)=>{
            return response.text();
        })
        .then((data)=>{
            window.location.href = 'http://localhost:8080/community/detail?communitySeq=' + postSeq ;
            alert(data);
        })
        .catch((error)=>{
            alert(error);
        })
    })
})


const deleteCommentBtn = document.querySelectorAll(".deleteCommentBtn");

deleteCommentBtn.forEach((e,index)=>{

    e.addEventListener("click",()=>{
        const confirmed = confirm("삭제하시겠습니가?");
        if(confirmed){
            const seq = replyCommentSeq[index].value;
            const postSeq = replyUpdateCommentPostSeq[index].value;

            fetch("/community/comment/delete/"+seq,{
                method : "DELETE",
                headers : {"Content-type" : "application/json"}
            })
            .then((response)=>{
                return response.text();
            })
            .then((data)=>{
                 window.location.href = 'http://localhost:8080/community/detail?communitySeq=' + postSeq ;
                alert(data);
            })
            .catch((error)=>{
                alert(error)
            })
        } 
    })
})


const communityList = document.querySelectorAll(".communityList");
const communityListForm = document.querySelector("#communityListForm");

const recentTenCommunityList = document.querySelectorAll(".recentTenCommunityList");

recentTenCommunityList.forEach((e) => {
    e.addEventListener("click",()=>{
        communityListForm.elements["communitySeq"].value = e.dataset.recentCommunitySerial
        communityListForm.submit();
    })
})