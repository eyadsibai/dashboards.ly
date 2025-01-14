
from os.path import abspath, dirname
import os

_cwd = dirname(abspath(__file__))


class Config(object):
    PLOTLY_API_DOMAIN = os.environ.get(
        "PLOTLY_API_DOMAIN", "https://api.plot.ly")
    PLOTLY_DOMAIN = os.environ.get(
        "PLOTLY_DOMAIN", "https://plot.ly")


class ProductionConfig(Config):
    """
    Heroku
    """
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '')

    ENVIRONMENT = 'PROD'


class DevelopmentConfig(Config):
    """
    localhost
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://chriddyp@localhost/chriddyp'

    ENVIRONMENT = 'DEV'


class TestingConfig(DevelopmentConfig):
    import warnings
    warnings.filterwarnings("ignore")
    # http://stackoverflow.com/questions/26647032/py-test-to-test-flask-register-assertionerror-popped-wrong-request-context
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    TESTING = True
