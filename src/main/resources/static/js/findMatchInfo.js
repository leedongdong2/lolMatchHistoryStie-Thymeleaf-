    const serchMatchLinks = document.querySelectorAll(".serchMatchLink");   
    const serchMatchTypeLinks = document.querySelectorAll(".macthType");
    const serchMatchForm = document.querySelector("#serchMatchForm");
    const serchRiotId = document.getElementById("serchRiotId").value;
    const serchRegion = document.getElementById("serchRegion").value;

    const overviewBox = document.querySelectorAll(".overviewBox");


    const overviewHasLoaded = new Array(overviewBox.length).fill(false);
    const buildHasLoaded = new Array(overviewBox.length).fill(false);
    const etcHasLoaded = new Array(overviewBox.length).fill(false);


    const findMatchInfoFragmentBox = document.getElementById("findMatchInfoFragmentBox");





    document.addEventListener("DOMContentLoaded",()=>{
        updateMatchColors();
    });


    //승리와 패배에 따라서 div의 백그라운드 컬러를 바꿔줌
    function updateMatchColors() {
         const searchIdWin = document.querySelectorAll(".searchIdWin");
         const riotMatchDtoBox = document.querySelectorAll(".riotMatchDtoBox");
         const showMatchInfoMore = document.querySelectorAll(".showMatchInfoMore");

        searchIdWin.forEach((e,index)=>{
            const text = e.innerHTML;
            if(text == "승리") { 
                e.style.color = "#5382DE";
                riotMatchDtoBox[index].style.backgroundColor = "#28344E";
                showMatchInfoMore[index].style.backgroundColor = "#445988ff";
            } else {
                e.style.color = "#E84057";
                riotMatchDtoBox[index].style.backgroundColor = "#59343B";
                showMatchInfoMore[index].style.backgroundColor = "#794b53ff";
            }
        });

    }

      tippy('[data-tippy-content]', {
                                    allowHTML: true
                                });



    //더보기시 추가된 html에 이벤트를 쓰기 위해 document전체에 이벤트를 걸어놓고 
    //이벤트가 발동될시 걸어놓은 class의 index를 추적해 함수를 발동한다
    //동적으로 추가된 요소에 이벤트를 걸기위함 -이벤트 위임-
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("overviewTogglePoint")) {
            const index = [...document.querySelectorAll(".overviewTogglePoint")].indexOf(e.target);
            showOverviewTogglePoint(index);
        }

        if (e.target.classList.contains("matchInfoOverview")) {
            const index = [...document.querySelectorAll(".matchInfoOverview")].indexOf(e.target);
            showMatchInfoOverview(index);
        }

        if (e.target.classList.contains("matchInfoBuild")) {
            const index = [...document.querySelectorAll(".matchInfoBuild")].indexOf(e.target);
            showMatchInfoBuild(index);
        }

        if(e.target.classList.contains("matchInfoEtc")) {
            const index = [...document.querySelectorAll(".matchInfoEtc")].indexOf(e.target);
            showMatchInfoEtc(index);
        }

        
    })















    //매칭의 상세정보를 알아온다
    function showOverviewTogglePoint(index) {
            const overviewBox = document.querySelectorAll(".overviewBox");

            const matchInfoOverview = document.querySelectorAll(".matchInfoOverview");
            const matchInfoOverviewContainer = document.querySelectorAll(".matchInfoOverviewContainer");

            const searchIdWin = document.querySelectorAll(".searchIdWin");

            const riotMatchIdListElements = document.querySelectorAll(".riotMatchIdList");
            const riotMatchIdList = [...riotMatchIdListElements].map(el => el.value);


            if(overviewBox[index].style.display == "none"){
                overviewBox[index].style.display = "block";
                matchInfoOverviewContainer[index].style.display = "block";
                matchInfoOverview[index].style.backgroundColor = "#ffffff96"
                if(!overviewHasLoaded[index]) {
                        const riotMatchId = riotMatchIdList[index];
                        
                        const params = new URLSearchParams({
                            riotId : serchRiotId,
                            region : serchRegion,
                            riotMatchId : riotMatchId
                        });

                        fetch('/findMatchInfo/overview?'+ params.toString(), {
                            method : 'GET',
                        })
                        .then(response => {
                            if (!response.ok) throw new Error('Fetch 실패: ' + response.status);
                            return response.text();
                        })
                        .then(data => {

                            matchInfoOverviewContainer[index].innerHTML = data;
                               tippy('[data-tippy-content]', {
                                    allowHTML: true
                                });

                                const searchIdTeamBox = document.querySelectorAll(".searchIdTeamBox");
                                const nonSearchIdTeamBox = document.querySelectorAll(".nonSearchIdTeamBox");
                                
                                searchIdWin.forEach((e,index)=>{
                                    const text = e.innerHTML;
                                    if( text == "승리" ) {
                                        searchIdTeamBox[index].style.backgroundColor = "#28344E";
                                        nonSearchIdTeamBox[index].style.backgroundColor = "#59343B";
                                    } else {
                                        searchIdTeamBox[index].style.backgroundColor = "#59343B";
                                        nonSearchIdTeamBox[index].style.backgroundColor = "#28344E";
                                    }
                                })
                        })
                        .catch(e => {
                            console.error('Ajax 오류:', e);
                        });
                    overviewHasLoaded[index] = true;
                }

            } else {
                overviewBox[index].style.display = "none";
            }
        }

    
    
    function showMatchInfoOverview(index) {    

            const matchInfoOverviewContainer = document.querySelectorAll(".matchInfoOverviewContainer");
            const matchInfoBuildContainer = document.querySelectorAll(".matchInfoBuildContainer");
            const matchInfoEtcContainer = document.querySelectorAll(".matchInfoEtcContainer");

            const matchInfoOverview = document.querySelectorAll(".matchInfoOverview");
            const matchInfoBuild = document.querySelectorAll(".matchInfoBuild");
            const matchInfoEtc = document.querySelectorAll(".matchInfoEtc");

            matchInfoOverviewContainer[index].style.display = "block";
            matchInfoBuildContainer[index].style.display = "none";
            matchInfoEtcContainer[index].style.display = "none";

            matchInfoOverview[index].style.backgroundColor = "#ffffff96";            
            matchInfoBuild[index].style.backgroundColor = "#31313C";
            matchInfoEtc[index].style.backgroundColor = "#31313C";
    }

    //빌드 페이지 열기
    function showMatchInfoBuild(index) {

            const matchInfoOverviewContainer = document.querySelectorAll(".matchInfoOverviewContainer");
            const matchInfoBuildContainer = document.querySelectorAll(".matchInfoBuildContainer");
            const matchInfoEtcContainer = document.querySelectorAll(".matchInfoEtcContainer");

            const matchInfoOverview = document.querySelectorAll(".matchInfoOverview");
            const matchInfoBuild = document.querySelectorAll(".matchInfoBuild");
            const matchInfoEtc = document.querySelectorAll(".matchInfoEtc");

            const riotMatchIdListElements = document.querySelectorAll(".riotMatchIdList");
            //같은 class를 지닌 input의 value들을 배열화함
            const riotMatchIdList = [...riotMatchIdListElements].map(el => el.value);

             const riotMatchId = riotMatchIdList[index];

            const serchIdParticipantId = document.querySelectorAll(".serchIdParticipantId");

            matchInfoOverviewContainer[index].style.display = "none";
            matchInfoBuildContainer[index].style.display = "block";
            matchInfoEtcContainer[index].style.display = "none";


            
            matchInfoOverview[index].style.backgroundColor = "#31313C";            
            matchInfoBuild[index].style.backgroundColor = "#ffffff96";
            matchInfoEtc[index].style.backgroundColor = "#31313C";

                    
                if(!buildHasLoaded[index]) {
                    const params = new URLSearchParams({
                        riotId : serchRiotId,
                        region : serchRegion,
                        riotMatchId : riotMatchId,
                        participantId : serchIdParticipantId[index].dataset.riotSerchidParticipantid
                    });
                    fetch('/findMatchInfo/build?' + params.toString(),{
                                method : 'GET',
                            })
                            .then(response => {
                                if (!response.ok) throw new Error('Fetch 실패: ' + response.status);
                                return response.text();
                            })
                            .then(data => {
                                matchInfoBuildContainer[index].innerHTML = data;
                                tippy('[data-tippy-content]', {
                                    allowHTML: true
                                });
                            })
                            .catch(e => {
                                console.error('Ajax 오류:', e);
                            });
                            buildHasLoaded[index] = true;
                        }
        }    
                

        //챠트 페이지
        function showMatchInfoEtc(index) { 

            const matchInfoOverviewContainer = document.querySelectorAll(".matchInfoOverviewContainer");
            const matchInfoBuildContainer = document.querySelectorAll(".matchInfoBuildContainer");
            const matchInfoEtcContainer = document.querySelectorAll(".matchInfoEtcContainer");

            const matchInfoOverview = document.querySelectorAll(".matchInfoOverview");
            const matchInfoBuild = document.querySelectorAll(".matchInfoBuild");
            const matchInfoEtc = document.querySelectorAll(".matchInfoEtc");

            const riotMatchIdListElements = document.querySelectorAll(".riotMatchIdList");
            const riotMatchIdList = [...riotMatchIdListElements].map(el => el.value);
            const riotMatchId = riotMatchIdList[index];

            const serchIdParticipantId = document.querySelectorAll(".serchIdParticipantId");



            matchInfoOverviewContainer[index].style.display = "none";
            matchInfoBuildContainer[index].style.display = "none";
            matchInfoEtcContainer[index].style.display = "block";

            matchInfoOverview[index].style.backgroundColor = "#31313C";            
            matchInfoBuild[index].style.backgroundColor = "#31313C";
            matchInfoEtc[index].style.backgroundColor = "#ffffff96";


            const params = new URLSearchParams({
                riotId : serchRiotId,
                region : serchRegion,
                riotMatchId : riotMatchId,
                participantId : serchIdParticipantId[index].dataset.riotSerchidParticipantid
            });

            if(!etcHasLoaded[index]) {
              fetch('/findMatchInfo/etc',{
                        method : 'GET',
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('Fetch 실패: ' + response.status);
                        return response.text();
                    })
                    .then(data => {
                        matchInfoEtcContainer[index].innerHTML = data;
                        fetch('/findMatchInfo/etc/chart?'+ params.toString(),{
                            method : 'GET',
                        })
                        .then((response)=>{
                           return response.json();
                        })
                        .then((goldAndCsChartData)=>{
                               const ctx = document.getElementById('goldCsChart').getContext('2d');

                                new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: goldAndCsChartData.intervals,  // X축: 시간 구간
                                        datasets: [
                                            {
                                                label: '총 골드량',
                                                data: goldAndCsChartData.goldList,
                                                borderColor: 'gold',
                                                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                                yAxisID: 'goldAxis',  // 왼쪽 축 사용
                                                tension: 1.0
                                            },
                                            {
                                                label: 'CS 수',
                                                data: goldAndCsChartData.csList,
                                                borderColor: 'skyblue',
                                                backgroundColor: 'rgba(135, 206, 250, 0.2)',
                                                yAxisID: 'csAxis',  // 오른쪽 축 사용
                                                tension: 0.4
                                            }
                                        ]
                                    },
                                    options: {
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: '시간별 골드 & CS',
                                                font: { size: 18 }
                                            },
                                            legend: {
                                                display: true
                                            },
                                            datalabels: {
                                                display: true,
                                                color: 'blue',
                                                font: {
                                                    weight: 'bold'
                                                },
                                                formatter: function(value, context) {
                                                    return value;
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: '시간 (분)',
                                                    font: { size: 14 }
                                                },
                                                ticks: {
                                                    callback: function(value, index) {
                                                        return goldAndCsChartData.intervals[index] * 4 + '분';  // 0,1,2 → 0분, 4분, 8분...
                                                    }
                                                }
                                            },
                                            goldAxis: {
                                                type: 'linear',
                                                position: 'left',
                                                title: {
                                                    display: true,
                                                    text: '총 골드량'
                                                }
                                            },
                                            csAxis: {
                                                type: 'linear',
                                                position: 'right',
                                                title: {
                                                    display: true,
                                                    text: 'CS 수'
                                                },
                                                grid: {
                                                    drawOnChartArea: false  // 오른쪽 축 격자선 제거
                                                }
                                            }
                                        }
                                    },
                                    plugins: [ChartDataLabels]  // 숫자 표시 플러그인 활성화
                                });
                        })

                    })
                    .catch(e => {
                        console.error('Ajax 오류:', e);
                    });
                }
            }
    
    
    const findMatchInfoShowMoreBox = document.getElementById("findMatchInfoShowMoreBox");

    let startcount = 0;


    //더보기를 눌럿을떄 전적검색을 더 가져온다
    
    findMatchInfoShowMoreBox.addEventListener("click",()=>{
        const serchMatchType = document.getElementById("serchMatchType").value;
        startcount = startcount + 5;

        const gameCount = document.querySelector('[data-game-count]');
        let gameCountData = gameCount.dataset.gameCount; 
        const winCount = document.querySelector('[data-win-count]');
        let winCountData = winCount.dataset.winCount; 
        const loseCount = document.querySelector('[data-lose-count]');
        let loseCountData = loseCount.dataset.loseCount; 

        const topCount = document.querySelector('[data-top-line-count]');
        let topCountData = topCount.dataset.topLineCount;
        const midCount = document.querySelector('[data-mid-line-count]');
        let midCountData = midCount.dataset.midLineCount;
        const jungleCount = document.querySelector('[data-jungle-line-count]');
        let jungleCountData = jungleCount.dataset.jungleLineCount;
        const adCarryCount = document.querySelector('[data-ad-carry-line-count]');
        let adCarryCountData = adCarryCount.dataset.adCarryLineCount;
        const supportCount = document.querySelector('[data-support-line-count]');
        let supportCountData = supportCount.dataset.supportLineCount;

        const topBar = document.querySelector('[data-top-line-count]');
        const midBar = document.querySelector('[data-mid-line-count]');
        const jungleBar = document.querySelector('[data-jungle-line-count]');
        const adCarryBar = document.querySelector('[data-ad-carry-line-count]');
        const supportBar = document.querySelector('[data-support-line-count]');


        const params = new URLSearchParams({
            riotId : serchRiotId,
            region : serchRegion,
            matchType : serchMatchType,
            matchStartIndex : startcount,
            gameCount : gameCountData,
            winCount : winCountData,
            loseCount : loseCountData,
            topLineCount : topCountData,
            midLineCount : midCountData,
            jungleLineCount : jungleCountData,
            adCarryLineCount : adCarryCountData,
            supportLineCount : supportCountData
            
        });
        

        fetch('/riotMatchInfo/more?' + params.toString(),{
            method : 'GET',
        })
        .then(response => {
            if (!response.ok) throw new Error('Fetch 실패: ' + response.status);
            return response.text();
        })
        .then(data => {
            tippy('[data-tippy-content]', {
                allowHTML: true
            });
            //html을 어느 순서로 (앞 뒤) 붙일지 조정할수잇다
            findMatchInfoFragmentBox.insertAdjacentHTML("beforeend",data);

            updateMatchColors();
            const lineData = document.getElementById("lineData");
            

            //늘려진 전적검색에 맞추어서 승패와 라인 배율을 조정
            gameCount.innerText = lineData.dataset.gameCount + "전";
            gameCount.dataset.gameCount = lineData.dataset.gameCount;

            winCount.innerText = lineData.dataset.winCount + "승";
            winCount.dataset.winCount = lineData.dataset.winCount;
            
            loseCount.innerText = lineData.dataset.loseCount + "패";
            loseCount.dataset.loseCount = lineData.dataset.loseCount;
            
            topBar.style.height = lineData.dataset.topPercent + '%';
            midBar.style.height = lineData.dataset.midPercent + '%';
            jungleBar.style.height = lineData.dataset.junglePercent + '%';
            adCarryBar.style.height = lineData.dataset.adCarryPercent + '%';
            supportBar.style.height = lineData.dataset.supportPercent + '%';

            topBar.dataset.topLineCount = lineData.dataset.topCount
            midBar.dataset.midLineCount = lineData.dataset.midCount
            jungleBar.dataset.jungleLineCount = lineData.dataset.jungleCount
            adCarryBar.dataset.adCarryLineCount = lineData.dataset.adCarryCount
            supportBar.dataset.supportLineCount = lineData.dataset.supportCount
            
            const count = 5;
            

            //overview,build,etc 가 열린지 체크하는 배열을 추가로 만들어줌
            for(let i = 0;i < count;i++) {
                overviewHasLoaded.push(false);
                buildHasLoaded.push(false);
                etcHasLoaded.push(false);
            }




            lineData.remove();
        })
        .catch(e => {
            console.error('Ajax 오류:', e);
        });

    })



    










    serchMatchTypeLinks.forEach( (e) => {
        e.addEventListener("click",serchMatchbyTypeInfo);
    })



    

    serchMatchLinks.forEach( (e) => {
        e.addEventListener("click",serchMathInfo);
    })


   
   
   
    function serchMathInfo(e) {
        serchMatchForm.querySelector("#region").value = serchMatchForm.querySelector("#serchRegion").value;
        serchMatchForm.querySelector("#riotId").value = e.target.dataset.riotId;
        serchMatchForm.submit();

    }

    function serchMatchbyTypeInfo(e) {
        
        serchMatchForm.querySelector("#region").value = serchMatchForm.querySelector("#serchRegion").value;
        serchMatchForm.querySelector("#riotId").value = serchMatchForm.querySelector("#serchRiotId").value;


        
        switch(e.target.textContent){

            case "전체":
                serchMatchForm.querySelector("#serchMatchType").value = "";
            break;
            case "랭크":
                serchMatchForm.querySelector("#serchMatchType").value = "420";
            break;
            case "칼바람":
                serchMatchForm.querySelector("#serchMatchType").value = "450";
            break;
        } 
        
        serchMatchForm.submit();
    }