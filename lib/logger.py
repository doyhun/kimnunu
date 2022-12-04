import logging
import logging.config
import os

from lib.config import LoggerConfig


class Logger():
    @classmethod
    def get_logger(cls, filename='temp'):
        conf_dir = os.path.dirname(os.path.abspath(__file__))
        log_file = f'{LoggerConfig.path}/logs/flask/flask.log'

        logging.config.fileConfig(f'{conf_dir}/logger.conf', defaults={'filename': log_file})
        return logging.getLogger()
