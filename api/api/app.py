import os
import json

from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from dynaconf import FlaskDynaconf
from sqlalchemy.exc import DatabaseError

import api.models as models
import api.routes as routes

def create_app():
  app = Flask(__name__)
  FlaskDynaconf(app) # Initialize config

  app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://{}:{}@{}/{}".format(
    app.config['DB_USER'],
    app.config['DB_PASSWORD'],
    app.config['DB_HOST'],
    app.config['DB_NAME'])

  app.logger.info('App configured to talk to DB: %s', app.config['SQLALCHEMY_DATABASE_URI'])

  models.db.init_app(app) # This needs to come before Marshmallow
  migrate = Migrate(app, models.db)
  ma = Marshmallow(app)
  routes.api.init_app(app)

  @app.route('/')
  def hello():
    return 'Hello, Brian!'

  @app.shell_context_processor
  def make_shell_context():
    """
     Adds these to the global scope of the shell for more convenient prototyping/debugging in the shell
     """
    from api.utils import module_classes_as_dict

    return {'db': models.db,
            **module_classes_as_dict('api.models'),
            **module_classes_as_dict('api.schemas'),
            **module_classes_as_dict('api.tests.factories')}


  @app.after_request
  def session_commit(response):
    if response.status_code >= 400:
      return response
    try:
      models.db.session.commit()
      return response
    except DatabaseError:
      models.db.session.rollback()
      raise

  return app
