import uuid

from datetime import datetime
from flask import current_app
from flask_sqlalchemy import SQLAlchemy, Model

import sqlalchemy
from sqlalchemy.exc import DatabaseError
from sqlalchemy.orm import backref
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID

from google.cloud import storage

# Lifted from https://chase-seibert.github.io/blog/2016/03/31/flask-sqlalchemy-sessionless.html
class MyBase(Model):
  '''Adds convenience methods to every model instance. '''
  def save(self):
    db.session.add(self)
    self._flush()
    return self

  def update(self, **kwargs):
    for attr, value in kwargs.items():
      setattr(self, attr, value)
      return self.save()

  def delete(self):
    db.session.delete(self)
    self._flush()

  def _flush(self):
    try:
      db.session.flush()
    except DatabaseError:
      db.session.rollback()
      raise

db = SQLAlchemy(model_class=MyBase)

class Video(db.Model):
  __tablename__ = 'videos'

  id = db.Column(UUID(as_uuid=True), server_default=sqlalchemy.text("gen_random_uuid()"), primary_key=True)

  url = db.Column(db.String(512))

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  @staticmethod
  def create_and_upload(file):
    video = Video()
    video.save()

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(current_app.config['VIDEO_BUCKET'])
    blob = bucket.blob(str(video.id))

    blob.upload_from_file(file.stream, predefined_acl="publicRead")

    video.update(url=blob.public_url)

    return video

  def __repr__(self):
    return '<Video:{}>'.format(self.id)


class Challenge(db.Model):
  __tablename__ = 'challenges'

  id = db.Column(UUID(as_uuid=True), server_default=sqlalchemy.text("gen_random_uuid()"), primary_key=True)

  title = db.Column(db.Unicode(length=255), nullable=False)
  instructions = db.Column(db.UnicodeText, nullable=False)
  grading_notes = db.Column(db.UnicodeText, nullable=False)

  creator = db.relationship('User', backref='challenges')
  creator_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))

  video = db.relationship('Video', backref=backref('challenges', uselist=False))
  video_id = db.Column(UUID(as_uuid=True), db.ForeignKey('videos.id'), nullable=True)

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<Challenge:{} - {}>'.format(self.id, self.title)


class User(db.Model):
  __tablename__ = 'users'

  id = db.Column(UUID(as_uuid=True), server_default=sqlalchemy.text("gen_random_uuid()"), primary_key=True)
  name = db.Column(db.Unicode(255))
  email = db.Column(db.String(255), unique=True, nullable=False)

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<User:{} - {}>'.format(self.id, self.email)


class Response(db.Model):
  __tablename__ = 'responses'

  id = db.Column(UUID(as_uuid=True), server_default=sqlalchemy.text("gen_random_uuid()"), primary_key=True)

  challenge = db.relationship('Challenge', backref='responses')
  challenge_id = db.Column(UUID(as_uuid=True), db.ForeignKey('challenges.id'), primary_key=True)

  user = db.relationship('User', backref='responses')
  user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), primary_key=True)

  video = db.relationship('Video', backref=backref('response', uselist=False))
  video_id = db.Column(UUID(as_uuid=True), db.ForeignKey('videos.id'), nullable=True)

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<Response:{} - {}:{}>'.format(self.id, self.challenge.name, self.responder.name)
