# -*- coding: utf-8 -*-

from importlib.resources import contents
from re import search
from unicodedata import name
import pymysql
from flask import Flask, render_template, flash, redirect, url_for
from flask import request, jsonify, session

app = Flask(__name__)
app.secret_key = 'super_duper secret key'
app.config['SESSION_TYPE'] = 'filesystem'

#json encode
app.config['JSON_AS_ASCII'] = False

#DB connect
conn = pymysql.connect(host = '211.53.209.52', port = 3306, user = 'yodoc', passwd = 'yodocdev00!@', db = 'yodoc')

#remove cash
@app.after_request
def add_header(resp):
    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp

#main page
@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        return render_template('login.html')

#login
@app.route('/api/login',methods=['POST'])
def login():
    tel_no = request.form.get('tel_no')
    user_pw = request.form.get('user_pw')
    try:
        conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
        cur = conn.cursor()
        cur.execute("select * from userinfo where telNo =%s and userPw=%s;",(tel_no,user_pw))
        res = cur.fetchall()
        conn.close()
        print(res)

        user_id = res[0][0]
        user_group = res[0][3]
        session['user_id'] = user_id
        session['user_group'] = user_group
        print(session['user_id'])
        print(session['user_group'])

        if user_group == 'D':
            flash('로그인 성공했습니다.')
            return redirect(url_for('search_name'))
        if user_group == 'G':
            user_name = session['user_id']
            flash('로그인 성공했습니다.')
            return redirect(url_for('table',user_name=user_name))
        else:
            flash('로그인 실패했습니다.')
            return redirect(url_for('index'))
    except:
        flash('로그인 실패했습니다.')
        return redirect(url_for('index'))

#logout
@app.route('/api/logout')
def logout():
    #session drop
    session.pop("user_id", None)
    session.pop("user_group", None)
    print(session)
    flash("로그아웃 성공했습니다")
    return redirect(url_for('index'))

@app.route('/register',methods = ['GET','POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    try:
        if request.method == 'POST':
            user_id = request.form.get('user_id')
            user_pw = request.form.get('user_pw')
            user_name = request.form.get('user_name')
            tel_no = request.form.get('tel_no')

            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("insert into userinfo (userId,userPw,userName,userGroup,telNo) values('%s','%s','%s','D','%s');"%(user_id,user_pw,user_name,tel_no))
            conn.commit()
            conn.close()

            return redirect(url_for('index'))
    except:
        flash("회원가입에 실패했습니다.")
        return render_template('register.html')

def list_chuck(arr, n):
    return [arr[i: i + n] for i in range(0, len(arr), n)]

#search url
@app.route('/api/search_name', methods=['GET', 'POST'])
def search_name():
    if session == {}: 
        flash('로그인 후 이용해주세요')
        return redirect(url_for('index'))
    try:
        if request.method == 'GET':
            login_id = session['user_id']
            return render_template('index.html',login_id=login_id)

        if request.method == 'POST':
            search_name = request.form.get('search_name')
            login_id = session['user_id']
                
            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("select * from userinfo where userID = %s",search_name)
            res = cur.fetchall()
            conn.close()

            user_list=[]
            if res != ():
                for i in range(len(res)):
                    user_name = res[i][0]
                    tel_no= res[i][4]
                    user_list.append(user_name)
                    user_list.append(tel_no)
                    name = "이름"
                    tel = "전화번호"
            else:
                user_name = ""
                name = "환자를 찾을 수 없습니다."
                tel = " "
            
            user_list = list_chuck(user_list,2)
            return render_template('index.html',user_list=user_list,login_id=login_id,name=name,tel=tel)
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))


@app.route('/api/table')
def table():
    try:
        login_id = session['user_id']
        user_group = session['user_group']
        try:
            if user_group == 'D':
                user_name = request.args.get('user_name')
            if user_group == 'G':
                user_name = login_id
            session['user_name'] = user_name
            search_nm = user_name
            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("select a.testDate, a.testCnt,a.normalCount,a.careCount,a.dangerCount,a.warningCount, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'rbc') rbc, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'bil') bil, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'uro') uro, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'ket') ket, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'prot') prot, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'no2') no2, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'glu') glu, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'ph') ph, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'sg') sg, " +
                        "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'wbc') wbc " +
                        "from testhis a Where a.userId = %s group by a.testDate, a.testCnt",[search_nm])
            res = cur.fetchall()
            conn.close()
            res_list = []
            for i in range(len(res)):
                table_list = []
                table_list.append(res[i][2])
                table_list.append(res[i][3])
                table_list.append(res[i][4])
                table_list.append(res[i][5])
                table_list.append(i+1)
                table_list.append(res[i][6])
                table_list.append(res[i][7])
                table_list.append(res[i][8])
                table_list.append(res[i][9])
                table_list.append(res[i][10])
                table_list.append(res[i][11])
                table_list.append(res[i][12])
                table_list.append(res[i][13])
                table_list.append(res[i][14])
                table_list.append(res[i][15])
                res_list.append(table_list)
            print(res_list)  
            res_list.reverse()  
            return render_template('table.html',res=res,res_list=res_list,login_id=login_id,user_name=user_name,user_group=user_group)
        except:
             return render_template('table.html')
    except:
         flash('로그인 후 이용 부탁드립니다.')
         return redirect(url_for('index'))

@app.route('/api/charts')
def charts():
    try:
        login_id = session['user_id']
        user_name = session['user_name']
        user_group = session['user_group']
        return render_template('charts.html',login_id=login_id,user_name=user_name,user_group=user_group)
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))

@app.route('/api/json')
def json():
    user_name = request.args.get('user_name')
    conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
    cur = conn.cursor()
    cur.execute("select a.testDate, a.testCnt,a.normalCount,a.careCount,a.dangerCount,a.warningCount, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'rbc') rbc, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'bil') bil, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'uro') uro, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'ket') ket, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'prot') prot, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'no2') no2, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'glu') glu, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'ph') ph, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'sg') sg, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'wbc') wbc " +
                    "from testhis a Where a.userId = %s group by a.testDate, a.testCnt",[user_name])
    res = cur.fetchall()
    conn.close()
    print(res)

    rbc_list=[]
    bil_list=[]
    uro_list=[]
    ket_list=[]
    prot_list=[]
    no2_list=[]
    glu_list=[]
    ph_list=[]
    sg_list=[]
    wbc_list=[]
    list_list =[rbc_list,bil_list,uro_list,ket_list,prot_list,no2_list,glu_list,ph_list,sg_list,wbc_list]
    tests_list=[]
    for i in range(len(res)):
        rbc_list.append(res[i][6])
        bil_list.append(res[i][7])
        uro_list.append(res[i][8])
        ket_list.append(res[i][9])
        prot_list.append(res[i][10])
        no2_list.append(res[i][11])
        glu_list.append(res[i][12])
        ph_list.append(res[i][13])
        sg_list.append(res[i][14])
        wbc_list.append(res[i][15])
    
    for i in list_list:
        tests_list.append(i)
    return jsonify(tests_list)

@app.route('/api/t_json')
def t_json():
    user_name = request.args.get('user_name')
    conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
    cur = conn.cursor()
    cur.execute("select a.testDate, a.testCnt,a.normalCount,a.careCount,a.dangerCount,a.warningCount, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'rbc') rbc, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'bil') bil, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'uro') uro, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'ket') ket, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'prot') prot, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'no2') no2, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'glu') glu, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'ph') ph, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'sg') sg, " +
                    "(select max(aa.testVal) from testhis aa where aa.testCnt = a.testCnt and aa.userId = a.userId and aa.testDate = a.testDate and aa.testTime = a.testTime and aa.testCode = 'wbc') wbc " +
                    "from testhis a Where a.userId = %s group by a.testDate, a.testCnt",[user_name])
    res = cur.fetchall()
    conn.close()
    print(res)

    count_list = []
    for i in range(len(res)):
        count_list2=[]
        count_list2.append(res[i][2])
        count_list2.append(res[i][3])
        count_list2.append(res[i][4])
        count_list2.append(res[i][5])
        count_list.append(count_list2)

    return jsonify(count_list)

#comments main
@app.route('/api/board', methods=['GET'])
def board():
    try:
        login_id = session['user_id']
        user_name = session['user_name']
        user_group = session['user_group']
        if request.method == 'GET':
            user_name = request.args.get('user_name')

            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("select * from notice_bd WHERE G_name = '%s' order by IDXNO desc; "%(user_name))
            res = cur.fetchall()
            conn.close()
        
            com_list = []
            num = len(res)
            for i in range(len(res)):
                com_list1 = []
                com_list1.append(num - i)
                com_list1.append(res[i][0])
                com_list1.append(res[i][6])
                com_list1.append(res[i][5])
                com_list1.append(res[i][3])
                com_list1.append(res[i][4])
                com_list.append(com_list1)
            
            return render_template('board.html',com_list=com_list,login_id=login_id,user_name=user_name,user_group=user_group)
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))

#conmment write
@app.route('/api/write', methods=['GET','POST'])
def write():
    # if session == {}: #session에 userId가 없는 경우 로그인 페이지로 이동
    #     flash('로그인 후 이용해주세요')
    #     return redirect(url_for('index'))
    try:
        login_id = session['user_id']
        user_name = session['user_name']
        user_group = session['user_group']
        if request.method == 'GET':
                return render_template('write.html',login_id=login_id,user_name=user_name,user_group=user_group)
            
        if request.method == 'POST':
            title = request.form.get('title')
            contents = request.form.get('contents')
            print(title)
            print(contents)
            print(user_name)

            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("insert into notice_bd (title, contents, writer, G_name) values('%s','%s','%s','%s');"%(title, contents,login_id,user_name))
            conn.commit()
            conn.close()

            return redirect(url_for('board', user_name=user_name))
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))

#comments read
@app.route('/api/read', methods=['GET'])
def read():
    try:
        login_id = session['user_id']
        user_name = session['user_name']
        user_group = session['user_group']
        if request.method == 'GET':
            IDXNO = request.args.get('IDXNO')
            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("select * from notice_bd where IDXNO = %s",IDXNO)
            res = cur.fetchall()
            conn.close()
            contents = res[0][3]
            contents = contents.replace('\n', '<br>')
            print(res[0][3])
            return render_template('read.html',res=res,contents=contents,IDXNO=IDXNO,user_name=user_name,login_id=login_id,user_group=user_group)
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))

#comment update
@app.route('/api/update', methods=['GET','POST'])
def update():
    try:
        login_id = session['user_id']
        user_name = session['user_name']
        user_group = session['user_group']
        IDXNO = request.args.get('IDXNO')
        if request.method == 'GET':
            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("select title, contents, writer from notice_bd where IDXNO = %s",IDXNO)
            res = cur.fetchall()
            conn.close()

            title = res[0][0]
            contents = res[0][1]
            writer_id = res[0][2]
            if login_id == writer_id:
                return render_template('update.html',title=title,contents=contents,IDXNO=IDXNO,user_name=user_name,login_id=login_id,user_group=user_group)
            else:
                flash('작성자만 수정이 가능합니다.')
                return redirect(url_for('board', user_name=user_name))

        if request.method == 'POST':
            title = request.form.get('title')
            contents = request.form.get('contents')

            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("UPDATE notice_bd SET title = '%s', contents = '%s' WHERE IDXNO = '%s' AND writer = '%s';"%(title,contents,IDXNO,login_id))
            conn.commit()
            conn.close()
            return redirect(url_for('board', user_name=user_name))
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))

#comments delete
@app.route('/api/delete', methods=['GET'])
def delete():
    try:
        login_id = session['user_id']
        user_name = session['user_name']
        user_group = session['user_group']
        IDXNO = request.args.get('IDXNO')
        if request.method == 'GET':
            conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
            cur = conn.cursor()
            cur.execute("select writer from notice_bd where IDXNO = %s",IDXNO)
            res = cur.fetchall()
            conn.close()
            writer_id = res[0][0]
            if writer_id == login_id:
                conn = pymysql.connect(host='211.53.209.52', port=3306, user='yodoc', passwd='yodocdev00!@', db='yodoc')
                cur = conn.cursor()
                cur.execute("delete from notice_bd WHERE IDXNO = '%s' AND writer = '%s';"%(IDXNO, login_id))
                conn.commit()
                conn.close()
                return redirect(url_for('board', user_name=user_name))
            else:
                flash('작성자만 삭제가 가능합니다.')
                return redirect(url_for('board', user_name=user_name))
    except:
        flash('로그인 후 이용 부탁드립니다.')
        return redirect(url_for('index'))

#투석환자 모듈
import os
#from lib.debug import Debug
#from lib.logger import Logger
#logging = Logger.get_logger()

from views.drug_pred import Process


#투석환자 서비스
exe = Process()

@app.route("/drug",methods=['GET', 'POST'])
def drug_intro():
    if request.method == 'GET':
        return render_template('drug.html', result = {})
    elif request.method == 'POST':
        input_dic = dict(request.form)
        input_dic = exe.predict(input_dic)
        return render_template('drug.html', result = input_dic)
    
@app.route("/about",methods=['GET', 'POST'])
def about():
    if request.method == 'GET':
        return render_template('img.html')      

app.run(port=8000, debug=True)