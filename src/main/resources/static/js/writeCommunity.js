






document.addEventListener("DOMContentLoaded", function () {


let oEditors = [];

nhn.husky.EZCreator.createInIFrame({
    oAppRef: oEditors,
    elPlaceHolder: "communityContent",
    sSkinURI: "/smarteditor2/SmartEditor2Skin.html",
    fCreator: "createSEditor2"
});

// 폼 전송 시 스마트에디터 값 동기화
 function submitContents(elForm) {
    oEditors.getById["communityContent"].exec("UPDATE_CONTENTS_FIELD", []);

    let content = document.getElementById("communityContent").value;
    let title = document.getElementById("communityTitle").value;
    content = (content || "").replace(/^\s+/, "");

    if (content === "") {
        alert("내용을 입력해주세요!");
        return false;
    } else if(title == "") {
        alert("제목을 입력해주세요!");
    } else {


        fetch("/community/write",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({content : content,
                                  title : title
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
window.submitContents = submitContents;    

});








