const findMemberBoardBox = document.querySelectorAll(".findMemberBoardBox");
const getFindMemberBoardDetailForm = document.getElementById("getFindMemberBoardDetailForm");
const recentTenFindMemberBoardList = document.querySelectorAll(".recentTenFindMemberBoardList");

findMemberBoardBox.forEach((e) =>{
    e.addEventListener("click",()=>{
        getFindMemberBoardDetailForm.elements["findMemberBoardSeq"].value = e.dataset.findMemberBoardSeq
        getFindMemberBoardDetailForm.submit();
    });
})

recentTenFindMemberBoardList.forEach((e)=>{
    e.addEventListener("click",()=>{
        getFindMemberBoardDetailForm.elements["findMemberBoardSeq"].value = e.dataset.recentFindMemberBoardSerial
        getFindMemberBoardDetailForm.submit();
    })
})



//입력
const findMemberBoardWriteFormBtn = document.getElementById("findMemberBoardWriteFormBtn");
const findMemberBoardWriteForm = document.getElementById("findMemberBoardWriteForm");

if(findMemberBoardWriteFormBtn){
findMemberBoardWriteFormBtn.addEventListener("click",writeFindMemberBoardDetail);
}
function writeFindMemberBoardDetail() {
    const formData = new FormData(findMemberBoardWriteForm);
    const jsonData = {}

    formData.forEach((value,key)=>{
        jsonData[key] = value;
    })

    fetch(('/findMemberBoard/write'),{
     method : 'POST',
     headers : {
        'Content-type' : 'application/json'
     },
     body : JSON.stringify(jsonData)   
    })
    .then((response)=>{
        return response.text();
    })
    .then((data)=>{
        alert(data);
        window.location.href = 'http://localhost:8080/findMemberBoard';
    })
    .catch((error) => {
        alert(error);
    })

}




// 업데이트
const findMemberBoardUpdateBtn = document.getElementById("findMemberBoardUpdateBtn");

if(findMemberBoardUpdateBtn){
findMemberBoardUpdateBtn.addEventListener("click",updateFindMemberBoardDetail);
}

async function updateFindMemberBoardDetail() {
    const seq = document.getElementById("findMemberBoardUpdateFormSeq").value;
    const form = document.getElementById("findMemberBoardUpdateForm");
    const formData = new FormData(form);
    const jsonData = {}

    formData.forEach((value,key) => {
        jsonData[key] = value;
    });

    await fetch('/findMemberBoard/update/'+ seq,{
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(jsonData)

    })
    .then((response) => {
        return response.text();
    })
    .then((data)=>{
        alert(data);
        window.location.href = 'http://localhost:8080/findMemberBoard';
    })
    .catch((error)=>{
        alert(error);
    })
       
}

//삭제

const findMemberBoardDeleteBtn = document.getElementById("findMemberBoardDeleteBtn");
if(findMemberBoardDeleteBtn){
findMemberBoardDeleteBtn.addEventListener("click",deleteFindMemberBoardDetail);
}
function deleteFindMemberBoardDetail() {
     const isConfirmed = confirm("정말로 이 글을 삭제하시겠습니가?");

    if(isConfirmed){
        const seq = document.getElementById("findMemberBoardUpdateFormSeq").value;
        fetch("/findMemberBoard/delete/"+seq,{
            method : "DELETE",
            headers : {
                "Content-type" : "application/json"
            },
        })
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            alert(data);
            window.location.href = 'http://localhost:8080/findMemberBoard';
        })
        .catch((error) => {
            alert(error);
        })
        }
        return false;
    } 


    const writefindMemberBoardDetailCommentBtn = document.getElementById("writefindMemberBoardDetailCommentBtn");

    if(writefindMemberBoardDetailCommentBtn){
    writefindMemberBoardDetailCommentBtn.addEventListener("click",writefindMemberBoardComment);
    }

    function writefindMemberBoardComment() {
        const isConfirmed = confirm("작성하시겠습니가?");
        
        if(isConfirmed){
            const findMemberBoardDetailCommentContent = document.getElementById("findMemberBoardDetailCommentContent").value;
            const findMemberBoardSeq = document.getElementById("findMemberBoardSeq").value;

            fetch("/findMemberBoard/comment/write",{
                method : "POST",
                headers : {
                    "Content-type" : "application/json"
                },
                body : 
                    JSON.stringify({
                        content : findMemberBoardDetailCommentContent,
                        seq : findMemberBoardSeq
                    })
            })
            .then((response)=>{
                return response.text();
            })
            .then((data)=>{
                alert(data);
                window.location.href = "/findMemberBoard/detail?findMemberBoardSeq="+ findMemberBoardSeq;
            })
            .error((error)=>{
                alert(error);
            })
        }
    }

    const updateFindmemberBoardDetailCommentBoxBtn = document.querySelectorAll(".updateFindmemberBoardDetailCommentBoxBtn");
    const updateFindmemberBoardDetailCommentBox = document.querySelectorAll(".updateFindmemberBoardDetailCommentBox");

    if(updateFindmemberBoardDetailCommentBoxBtn) {
        updateFindmemberBoardDetailCommentBoxBtn.forEach((e,index)=>{
            const box = updateFindmemberBoardDetailCommentBox[index];
            e.addEventListener("click",()=>{
                if(box.style.display === "none" || box.style.display === ""){
                    box.style.display = "block";
                } else {
                    box.style.display = "none";
                }
            })
        })
    }

    const updateFindmemberBoardDetailCommentContent = document.querySelectorAll(".updateFindmemberBoardDetailCommentContent");
    const updateFindmemberBoardDetailCommentBtn = document.querySelectorAll(".updateFindmemberBoardDetailCommentBtn");
    const commentSeq = document.querySelectorAll(".commentSeq");

    if(updateFindmemberBoardDetailCommentBtn) { 
        const findMemberBoardSeq = document.getElementById("findMemberBoardSeq").value;
        updateFindmemberBoardDetailCommentBtn.forEach((e,index)=>{
            e.addEventListener("click",()=>{
                const confirmed = confirm("수정하시겠습니가?");
                const content = updateFindmemberBoardDetailCommentContent[index].value;
                const seq = commentSeq[index].value;
                if(confirmed) {
                    fetch("/findMemberBoard/comment/update/"+ seq,{
                        method : "PUT",
                        headers : {
                            "Content-type" : "application/json"
                        },
                        body : JSON.stringify({
                            content : content
                        })
                    })
                    .then((response)=>{
                        return response.text();
                    })
                    .then((data)=>{
                        alert(data)
                        window.location.href = "/findMemberBoard/detail?findMemberBoardSeq="+ findMemberBoardSeq;
                    })
                }

            })    
        
        })
    }

const deleteFindmemberBoardDetailCommentBoxBtn = document.querySelectorAll(".deleteFindmemberBoardDetailCommentBoxBtn");

if(deleteFindmemberBoardDetailCommentBoxBtn) {
deleteFindmemberBoardDetailCommentBoxBtn.forEach((e,index)=>{
    e.addEventListener("click",()=>{
        const confirmed = confirm("삭제하시겠습니가?");
        if(confirmed) {
            const findMemberBoardSeq = document.getElementById("findMemberBoardSeq").value;
            const seq = commentSeq[index].value;
            fetch("/findMemberBoard/commnet/delete/" + seq,{
                method : "DELETE",
                headers : {
                    "Content-type" : "application/json"
                },
                body : JSON.stringify ({
                        seq : seq
                    })
            })
            .then((response)=>{
                return response.text();
            })
            .then((data)=>{
                alert(data);
                window.location.href = "/findMemberBoard/detail?findMemberBoardSeq="+ findMemberBoardSeq;
            })
        }
    })
})
}