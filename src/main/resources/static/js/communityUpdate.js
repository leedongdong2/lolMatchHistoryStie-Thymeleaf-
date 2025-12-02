
let oEditors = [];

nhn.husky.EZCreator.createInIFrame({
    oAppRef: oEditors,
    elPlaceHolder: "updateContent",
    sSkinURI: "/smarteditor2/SmartEditor2Skin.html",
    fCreator: "createSEditor2"
    });

 
  const updateBtn = document.getElementById("updateBtn");

  updateBtn.addEventListener("click",submitUpdateContents)  

     function submitUpdateContents(elForm) {
        elForm.preventDefault();

        oEditors.getById["updateContent"].exec("UPDATE_CONTENTS_FIELD", []);

        const communitySeq = document.getElementById("communitySeq").value;
        let updateContent = document.getElementById("updateContent").value;
        updateContent = (updateContent || "").replace(/^\s+/, "");
        
    if (updateContent === "") {
        alert("내용을 입력해주세요!");
        return false;
    } else {
        fetch("/community/updateCc/" + communitySeq,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
             body: JSON.stringify({content : updateContent
                                })
        })
        .then((response) => {
            return response.text();
        })
        .then((data)=>{
            window.location.href = 'http://localhost:8080/community';    
            alert(data);
        })
           .catch((error) => {
        console.error("오류 발생",error);
        alert("서버와 통신 중 오류가 발생하였습니다.");
        })
        return false;
    }
}


const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click",submitDeleteContent);

function submitDeleteContent(e) {
   e.preventDefault();
   const communitySeq = document.getElementById("communitySeq").value;
   const isConfirmed = confirm("정말로 이 글을 삭제하시겠습니가?");
    if (isConfirmed) {
        fetch("/community/deleteCc/" + communitySeq,{
            method : "DELETE",
            headers :  {"Content-type":"application/json"},
        })
        .then((response) => {
            return response.text();
        })
        .then((data) =>{
            window.location.href = 'http://localhost:8080/community'; 
            alert(data);
        })
             .catch((error) => {
        console.error("오류 발생",error);
        alert("서버와 통신 중 오류가 발생하였습니다.");
        })
        return false;
    }   
}
