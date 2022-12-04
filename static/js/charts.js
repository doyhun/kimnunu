function getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1);
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user_name = urlParams.get('user_name')
// console.log(user_name);
// fetch("http://127.0.0.1:5000/api/chart_json")
//     .then((response) => response.json())
//     .then((data) => console.log(data));

// const url = "http://127.0.0.1:5000/api/chart_json"
// console.log(url);
// const response = fetch(url);
// console.log(response);
// JSON.parse(url);

async function fetch_data() {
    // const url='/api/search_name?search_name=GET[user_name]';
    const url = 'http://127.0.0.1:8000/api/json?user_name='+user_name;
    // console.log(url)
    const response = await fetch(url); //url 정보 response로 받기
    //await = 요청이 완료될때까지 기다리기
    // console.log('response:' + response);
    const datapoints = await response.json(); //response에 있는 데이터를 제이슨 형태로 받기``
    // console.log('datapoints:' + datapoints);
    // console.log(getType (datapoints));
    const rbc = datapoints[0].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    // console.log(rbc);
    const bil = datapoints[1].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const uro = datapoints[2].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const ket = datapoints[3].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const prot = datapoints[4].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const no2 = datapoints[5].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const glu = datapoints[6].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const ph = datapoints[7].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const sg = datapoints[8].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    const wbc = datapoints[9].map(function(index) {
        return index; //인덱스 원하는 거 뽑아오기
    })
    let count = [];
    for(i = 1; i <= rbc.length; i ++) {
        count.push(i + '회차');
        // console.log(count);
    }
    
    const data1 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '잠혈',
            data: rbc,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    // console.log(data1)

    const data2 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '빌리루빈',
            data: bil,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data3 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '우로빌리노겐',
            data: uro,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data4 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '케톤체',
            data: ket,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data5 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '단백질',
            data: prot,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data6 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '아질산염',
            data: no2,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data7 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '포도당',
            data: glu,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data8 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '산도',
            data: ph,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data9 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '비중',
            data: sg,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const data10 = { //차트에 들어갈 설정
        labels: count,
        datasets: [{
            label: '백혈구',
            data: wbc,//데이터 부분에 위에서 가져온 정보 넣기
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 2, //그래프 선 굵기
            lineTension: 0, // 그래프 선 꺽임 정도
        }],
    };

    const config1 = {
        type: 'line', //그래프 종류
        data: data1, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false //툴팁 안 네모생]색상상자 지우기
            }
        },//end option
    };

    const config2 = {
        type: 'line', //그래프 종류
        data: data2, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };

    const config3 = {
        type: 'line', //그래프 종류
        data: data3, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config4 = {
        type: 'line', //그래프 종류
        data: data4, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config5 = {
        type: 'line', //그래프 종류
        data: data5, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config6 = {
        type: 'line', //그래프 종류
        data: data6, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config7 = {
        type: 'line', //그래프 종류
        data: data7, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config8 = {
        type: 'line', //그래프 종류
        data: data8, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config9 = {
        type: 'line', //그래프 종류
        data: data9, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };
    const config10 = {
        type: 'line', //그래프 종류
        data: data10, //데이터
        options: {
        responsive: true, //크기 자동
        interaction: {
            mode: 'index',
            intersect: false,
        },
        legend: {
            display: false //범례 표시 삭제
        },
        stacked: false,
        scales: {
            y: {
            type: 'linear',
            display: true,
            position: 'left',
            },
            y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            },
            },//end scales
            tooltips: {
                titleFontSize: 15,
                bodyFontSize: 15,
                displayColors: false
            }
        },//end option
    };

    new Chart(document.getElementById('ct_rbc'),config1); //config 데이터를 이용해서 ct_rbc 캔버스에 차트 만들기
    new Chart(document.getElementById('ct_bil'),config2);
    new Chart(document.getElementById('ct_uro'),config3);
    new Chart(document.getElementById('ct_ket'),config4);
    new Chart(document.getElementById('ct_prot'),config5);
    new Chart(document.getElementById('ct_no2'),config6);
    new Chart(document.getElementById('ct_glu'),config7);
    new Chart(document.getElementById('ct_ph'),config8);
    new Chart(document.getElementById('ct_sg'),config9);
    new Chart(document.getElementById('ct_wbc'),config10);

    let size = count.length * 100; //회차수 * 100 (한 회차 당 100px 차지)
    this.size = size + 'px'
    // if (size < 900) {
    //     this.size = 900 + 'px';
    // }
    // console.log(this.size);

    this.mk_rbc = function() {
        new Chart(document.getElementById('big_ch'),config1);
    }
    this.mk_bil = function() {
        new Chart(document.getElementById('big_ch'),config2);
    }
    this.mk_uro = function() {
        new Chart(document.getElementById('big_ch'),config3);
    }
    this.mk_ket = function() {
        new Chart(document.getElementById('big_ch'),config4);
    }
    this.mk_prot = function() {
        new Chart(document.getElementById('big_ch'),config5);
    }
    this.mk_no2 = function() {
        new Chart(document.getElementById('big_ch'),config6);
    }
    this.mk_glu = function() {
        new Chart(document.getElementById('big_ch'),config7);
    }
    this.mk_ph = function() {
        new Chart(document.getElementById('big_ch'),config8);
    }
    this.mk_sg = function() {
        new Chart(document.getElementById('big_ch'),config9);
    }
    this.mk_wbc = function() {
        new Chart(document.getElementById('big_ch'),config10);
    }
};
this.x = document.getElementsByClassName('chart_friend');

function hide_all() { //모두 숨기기
    for (i = 0; i < x.length; i ++) {
        this.x[i].style.display = 'none';
    }
    document.getElementById('big_con').style.display = '';
    document.getElementById('big_con').style.width ='90%'; 
    document.getElementById('big_con').style.margin ='1% 5%';
    document.getElementById('canvas_size').style.width = this.size;
}


function go_all() { //모두 보기
    for (i = 0; i < x.length; i ++) {
        this.x[i].style = '';
    }
    document.getElementById('big_con').style.display = 'none';
}

function go_rbc() {
    hide_all()
    document.getElementById('big_head').innerHTML = '잠혈';
    this.mk_rbc();
}

function go_bil() {
    hide_all()
    document.getElementById('big_head').innerHTML = '빌리루빈';
    this.mk_bil();
}

function go_uro() {
    hide_all()
    document.getElementById('big_head').innerHTML = '우로빌리노겐';
    this.mk_uro();
}

function go_ket() {
    hide_all()
    document.getElementById('big_head').innerHTML = '케톤체';
    this.mk_ket();
}

function go_prot() {
    hide_all()
    document.getElementById('big_head').innerHTML = '단백질';
    this.mk_prot();
}

function go_no2() {
    hide_all()
    document.getElementById('big_head').innerHTML = '아질산염';
    this.mk_no2();
}

function go_glu() {
    hide_all()
    document.getElementById('big_head').innerHTML = '포도당';
    this.mk_glu();
}

function go_ph() {
    hide_all()
    document.getElementById('big_head').innerHTML = '산도';
    this.mk_ph();
}

function go_sg() {
    hide_all()
    document.getElementById('big_head').innerHTML = '비중';
    this.mk_sg();
}

function go_wbc() {
    hide_all()
    document.getElementById('big_head').innerHTML = '백혈구';
    this.mk_wbc();
}