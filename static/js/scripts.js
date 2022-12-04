document.cookie = "user_name = {{user_name}}; path = /; max-age = 1800; saerch-name";
let state_list = []
async function fetch_table() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user_name = urlParams.get('user_name')
    // const url='/api/search_name?search_name=GET[user_name]';
    const url = 'http://127.0.0.1:8000/api/t_json?user_name='+user_name;
    // console.log(url)
    const response = await fetch(url); //url 정보 response로 받기
    //await = 요청이 완료될때까지 기다리기
    // console.log('response:' + response);
    const datapoints = await response.json(); //response에 있는 데이터를 제이슨 형태로 받기
    // console.log('datapoints:'+datapoints);
    state_list.push(datapoints);
    // console.log(state_list)
}

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    } //end if(sidebar)

});
//footer 올렸다 내리기
// var tog = 0;

// function ft_hs() {
//     if (tog == 0) {
//         footer.classList = 'footer_hide'
//         footer_evn.classList = 'footer_d footer_evn'
//         tog = 1;
//     } else {
//         footer.classList = 'footer_show'
//         footer_evn.classList = 'footer_u footer_evn'
//         tog = 0;
//     }
// }//end func ft_hs

// function ft_ch() {
//     if (tog == 0) {
//         footer.classList = 'footer_hide'
//         footer_evn.classList = 'footer_d footer_evn'
//     } else {
//         footer.classList = 'footer_show'
//         footer_evn.classList = 'footer_u footer_evn'
//     }
// }

//html에 생성되어 있는 table을 페이징하기
function Pager(tableName, itemsPerPage) {
    'use strict';
    var windowWidth = window.matchMedia("(max-width: 600px)");
    let page_group = 1 ; //페이지를 10개 단위로 구분해주는 역활
    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage; //한 페이지 당 나올 데이터의 수 (html script에서 설정)
    this.currentPage = 1; //현재 페이지
    this.pages = 0;
    this.inited = false;

    this.showRecords = function (from, to) { //테이블의 데이터를 표시하는 항목
        let rows = document.getElementById(tableName).rows; //테이블의 데이터 가져오기
        // console.log(rows);
        for (let i = 1; i < rows.length; i++) { //데이터를 첫번째 부터 마지막(데이터의 총 길이)까지 돌아가며 확인하기
            if (i < from || i > to) { //한페이지에 표시될 데이터의 수 from ~ to
                rows[i].style.display = 'none'; //화면에서 안보이기
                rows[i].className = 'off';
            } else {
                rows[i].style.display = ''; //화면에 나타내기
                rows[i].className = 'on';
            }
        }
    };

    this.showPage = function (pageNumber) { 
        if (!this.inited) {
            // Not initialized
            return;
        }
        let oldPageAnchor = document.getElementById('pg' + this.currentPage);
        oldPageAnchor.className = 'pg-normal'; //선택 안한 페이지 버튼 스타일 적용

        this.currentPage = pageNumber;
        let newPageAnchor = document.getElementById('pg' + this.currentPage);
        newPageAnchor.className = 'pg-selected'; //선택한 페이지 버튼 스타일 적용
        //from, to 계산
        let from = (pageNumber - 1) * itemsPerPage + 1; //from = (클릭된 페이지 - 1) * 한 페이지 당 표시 될 데이터 수 + 1 
        let to = from + itemsPerPage - 1; //to = 첫 데이터 + 한 페이지 당 표시 될 데이터 수 - 1
        if (windowWidth.matches) {
            // console.log('작은화면')
            let start = from - 1;
            // console.log(state_list.length)
            if (state_list.length !== 0){
                // console.log('안빔');
                now_table();
                // console.log(state_list);
            }
            else {
                // console.log('빔');
                setTimeout(now_table,2134);
                // console.log('실행')
            }
        }
        this.showRecords(from, to);
        function now_table() {
            let start = from - 1;
            document.getElementById('normal_c').innerHTML = '정상 수치: ' + state_list[0][start][0];
            document.getElementById('care_c').innerHTML = '주의 수치: ' + state_list[0][start][1];
            document.getElementById('warning_c').innerHTML = '경고 수치: ' + state_list[0][start][2];
            document.getElementById('danger_c').innerHTML = '위험 수치: ' + state_list[0][start][3];
        }
    };

   
    // this.prev = function () { //페이지 1개 이전으로 넘기기
    //     if (this.currentPage > 1) { //
    //         this.showPage(this.currentPage - 1);
    //     }
    // };

    // this.next = function () { //페이지 1개 다음으로 넘기기
    //     if (this.currentPage < this.pages) {
    //         this.showPage(this.currentPage + 1);
    //         this.current_page = first_page; //페이지를 넘겼을때 첫페이지 지정
    //     }
    // };

    this.init = function () {
        let rows = document.getElementById(tableName).rows;
        let records = (rows.length - 1);

        this.pages = Math.ceil(records / itemsPerPage); //총 페이지 수 계산 총 페이지 수 = 데이터 수 / 한 페이지당 표시 할 데이터 수
        this.inited = true;
        // console.log(this.pages)
    };


    this.showPageNav = function (pagerName, positionId) { //페이지 버튼 만들기
        if (!this.inited) {
            // Not initialized
            return;
        }

        let element = document.getElementById(positionId),
        
            // pagerHtml = '<span onclick= class="pg-normal" id="page_prev".mk_page(); console.log(this.page_group);> « </span>'; 
            pagerHtml = '<button class="pg-nomal" id="page_prev"> « </button>'; //page_prev버튼 만들기

            for (let page = 1; page <= this.pages; page++) { //페이지 버튼 만들기
                pagerHtml += '<span id="pg' + page + '" class="pg-normal pg-next" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span>'; //1페이지 부터 마지막 페이지 까지 만들기
                // console.log(page);
            }
            pagerHtml += '<button class="pg-nomal" id="page_next"> » </button>'; //page_next버튼 만들기

            if (this.pages <= 1) { //페이지 수가 1일 때 페이징 숨기기
                pagination.style.display = 'none';
            } else {
                pagination.style.display = '';
            };
            // pagerHtml += '<span onclick = class="pg-normal" id="page_next" .mk_page();> » </span>';
            // if (this.page < 11) {
            //     page_prev.style.display = 'none';
            //     page_next.style.display = 'none';
            // } else {
            //     page_prev.style.display = '';
            //     page_next.style.display = '';
            // };
        element.innerHTML = pagerHtml;
        
        if (this.pages <= this.itemsPerPage) {
            page_prev.style.display="none"
            page_next.style.display="none"

        } else {
            page_prev.style.display=""
            page_next.style.display=""
        }

        page_prev.addEventListener('click' ,() => { //page_prev 클릭 시 페이지 그룹 - 1, mk_page 실행
            if (page_group > 1) { //페이지 그룹이 1이 아니라면 줄이기 (첫 페이지 그룹에선 뒤로가기 x)
                page_group = page_group - 1;                
            }
            this.mk_page(); //버튼 새로고침
            this.showPage(this.first_page);//페이지 그룹 넘기면 첫 페이지 바꾸기
        });
        
        page_next.addEventListener('click' ,() => { //page_next 클릭 시 페이지 그룹 + 1, mk_page 실행
            let page_group_tt = Math.ceil(this.pages / this.itemsPerPage); //총 페이지 그룹 수 (총 페이지 수 / 한번에 나타낼 버튼 수)
    
            if (page_group < page_group_tt) { // 총 페이지 그룹 수 보다 작을때 늘리기 (마지막 페이지 그룹에선 다음 x)
                page_group = page_group + 1;
            }
            this.mk_page(); //버튼 새로고침
            this.showPage(this.first_page); //페이지 그룹 넘기면 첫 페이지 바꾸기
        });

        this.mk_page = function() {
            this.last_page = page_group * this.itemsPerPage; //나타낼 마지막 페이지는 페이지 그룹 * 표시 될 페이지 수
                if (this.last_page > this.pages) //마지막 페이지가 총 페이지보다 많다면
                    this.last_page = this.pages; //총 페이지가 마지막 페이지
            
            this.first_page = page_group * this.itemsPerPage - (this.itemsPerPage - 1); //나타낼 첫 페이지는 페이지그룹 * 표시 될 페이지 수 - (표시 될 페이지 수 - 1)
                if (this.first_page > this.pages) //첫 페이지가 총페이지보다 많다면
                    this.first_page = this.pages; //총 페이지가 첫 페이지
                
            // console.log(this.first_page);
            // console.log(this.last_page);


            for (let i = 1; i <= this.pages; i++) { //페이지 버튼 새로 만들기
                if (this.first_page <= i && this.last_page >= i) {
                    document.getElementById('pg' + i).style.display = '';
                    // console.log('pg_num' +i);
                    // console.log('for'+first_page);
                } else {
                    document.getElementById('pg' + i).style.display = 'none';
                    // console.log('for'+last_page);
                    // console.log('pg_none' + i);
                }
            }
        }
    };
}




