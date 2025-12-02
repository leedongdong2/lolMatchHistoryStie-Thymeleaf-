
const communityList = document.querySelectorAll(".communityList");
const communityListForm = document.querySelector("#communityListForm");
const searchForm = document.querySelector("#searchForm");
const searchOrder = document.querySelectorAll(".searchOrder");

communityList.forEach((e) => {
    e.addEventListener("click",() => {
        communityListForm.elements["communitySeq"].value = e.dataset.communitySerial
        communityListForm.submit();
    });
})

const recentTenCommunityList = document.querySelectorAll(".recentTenCommunityList");

recentTenCommunityList.forEach((e) => {
    e.addEventListener("click",()=>{
        communityListForm.elements["communitySeq"].value = e.dataset.recentCommunitySerial
        communityListForm.submit();
    })
})

searchOrder.forEach((e)=>{
    e.addEventListener("click",()=>{
        searchForm.searchOrder.value = e.innerText;
        searchForm.submit();
    })
})






