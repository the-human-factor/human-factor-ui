import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL', "postgres://human_factors_user@db/human_factors")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/')
def hello():
    return 'Hello, Brian!'

class Video(db.Model):
  uid = db.Column(db.String(32), primary_key=True)
  name = db.Column(db.String(128))
  ready_to_stream = db.Column(db.Boolean)

  thumbnail_url = db.Column(db.String(512))
  preview_url = db.Column(db.String(512))

  created_at = db.Column(db.DateTime(timezone=True))
  updated_at = db.Column(db.DateTime(timezone=True))


if __name__ == "__main__":
  app.run(host='0.0.0.0', port=9000)
