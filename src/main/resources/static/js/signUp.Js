const signUpForm = document.getElementById("signUpForm");
const idCheckAvailability =document.getElementById("idCheckAvailability");
const lolNameCheckAvailability = document.getElementById("lolNameCheckAvailability");
const nicknameCheckAvailability = document.getElementById("nicknameCheckAvailability");
let idcheck = false;
let lolNameCheck = false;
let nicknameCheck = false;




document.addEventListener('DOMContentLoaded', () => {


    if(idCheckAvailability){

        idCheckAvailability.addEventListener("click",()=>{
            
            const idRegex = /^[a-zA-Z0-9]{5,16}$/;

            const userId = signUpForm.tnName.value.trim();
                // 아이디 형식 검사
            if (!idRegex.test(userId)) {
                alert("아이디는 5~16자의 영문자 또는 숫자만 가능합니다.");
                e.preventDefault();
                return;
            }

            fetch('/user/signUp/check?tnName='+ userId,{
                method : "GET",
            })
            .then((response)=>{
                return response.text();
            })
            .then((data)=>{
                if(data=='1') {
                    alert("중복된 아이디가 있습니다.");
                } else {
                    idcheck = true;
                    alert("사용가능 한 아이디입니다.");
                }
            })
        })
    } else {
        idcheck = true;
    }

});

signUpForm.tnName.addEventListener("input",()=>{
    idcheck = false;
})


lolNameCheckAvailability.addEventListener("click",()=>{
    const lolName = signUpForm.lolName.value.trim();
    const lolNametag = signUpForm.lolNametag.value.trim();
    const region = signUpForm.region.value.trim();

    const tagRegex = /^#.*/;
    
    if(!tagRegex.test(lolNametag)) {
        alert("태그앞에 #을 꼭 붙여주세요.");
        return;
    }

    const params = new URLSearchParams({
                            lolName : lolName,
                            lolNametag : lolNametag,
                            region : region
                        });
    fetch('/user/signUp/lolNameCheck?' + params.toString(),{
        method : "GET"
    })
    .then((response)=>{
        if(response.ok) {
            lolNameCheck = true;
            return response.text();
        } else if(response.status === 404) {
            return response.text();
        }
    })                   
    .then((data)=>{
        alert(data)
    })

})

nicknameCheckAvailability.addEventListener("click",()=>{

    const nicknameRegex = /^[가-힣a-zA-Z0-9]{1,14}$/;

    const nickname = signUpForm.nickname.value.trim();

    if(!nicknameRegex.test(nickname)){
        alert("닉네임은 14글자까지 가능합니다");
        e.preventDefault();
        return;
    }

    fetch("/user/signUp/nicknameCheck?nickname=" + nickname,{
            method : "GET",
    })
    .then((respones)=>{
        return respones.text();
    })
    .then((data)=>{
        if(data == 1){
            alert("중복된 닉네임이 있습니다.");
        } else {
            nicknameCheck = true;
            alert("사용가능한 닉네임입니다");
        }
    })
    .catch((error)=>{
        alert(error);
    })
})

signUpForm.nickname.addEventListener("input",()=>{
    nicknameCheck = false;
})

signUpForm.lolName.addEventListener("input",()=>{
    lolNameCheck = false;
})

signUpForm.lolNametag.addEventListener("input",()=>{
    lolNameCheck = false;
})




signUpForm.addEventListener("submit",function(e){

    const userPw = document.getElementById("tnPassword").value;
    console.log(userPw)

    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    
    if(idcheck === false) {
        alert("아이디 중복검사를 해주세요.")
        e.preventDefault();
        return;
    }

    if(lolNameCheck === false) {
        alert("롤닉네임 검사를 해주세요.")
        e.preventDefault();
        return;
    }

    if(nicknameCheck === false) {
        alert("닉네임 중복검사를 해주세요.")
        e.preventDefault();
        return;
    }

    if(idCheckAvailability) {
        // 비밀번호 형식 검사
        if (!pwRegex.test(userPw)) {
            alert("비밀번호는 8~20자, 영문+숫자+특수문자를 모두 포함해야 합니다.");
            e.preventDefault();
            return;
        }
    }

    userSingUp(signUpForm);
    e.preventDefault();
});














async function userSingUp(signUpForm) {
    
    const formData = new FormData(signUpForm);

    const data = {};
    formData.forEach((value,key)=>{
        data[key] = value;
    });

        await fetch('http://localhost:8080/user/signUp',{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        })
        .then( (response) => {
            return response.text();
        })
        .then((data)=>{
             window.location.href = 'http://localhost:8080/login'
            alert(data);
        })
        .catch(error =>{
            alert("회원가입에 실패하였습니다");
        })
    
};







    