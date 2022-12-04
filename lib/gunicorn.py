user = 'jodal'
group = 'jodal'
base = '/data'

chdir = '/data/flask'
wsgi_app = 'wsgi:app'

daemon = True
workers = 4
worker_class = 'gevent'
timeout = 240

bind = f'unix:{base}/logs/gunicorn/gunicorn.sock'
pidfile = f'{base}/logs/gunicorn/gunicorn.pid'
worker_tmp_dir = f'{base}/tmp'

errorlog = f'{base}/logs/gunicorn/gunicorn.log'
loglevel = 'debug'

reload = False
