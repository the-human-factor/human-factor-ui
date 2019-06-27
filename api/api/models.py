import uuid

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

import sqlalchemy
from sqlalchemy.orm import backref
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID


db = SQLAlchemy()

class Video(db.Model):
  id = db.Column(UUID(as_uuid=True), server_default=sqlalchemy.text("uuid_generate_v4()"), primary_key=True)

  name = db.Column(db.Unicode(255))
  url = db.Column(db.String(512))

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)


  def __repr__(self):
    return '<Video:{} - {}>'.format(self.id, self.name)


class Challenge(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  name = db.Column(db.Unicode(length=255), nullable=False)
  description = db.Column(db.UnicodeText, nullable=False)
  grading_rubric = db.Column(db.UnicodeText, nullable=False)
  notes = db.Column(db.UnicodeText, nullable=False)

  video = db.relationship('Video', backref=backref('challenges', uselist=False))
  video_id = db.Column(UUID(as_uuid=True), db.ForeignKey('video.id'), nullable=True)

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<Challenge:{} - {}>'.format(self.id, self.name)


class Responder(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.Unicode(255))
  email = db.Column(db.String(255), unique=True, nullable=False)

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<Responder:{} - {}>'.format(self.id, self.email)


class Response(db.Model):
  id = db.Column(db.Integer, autoincrement=True, primary_key=True)

  challenge = db.relationship('Challenge', backref='responses')
  challenge_id = db.Column(db.Integer, db.ForeignKey('challenge.id'), primary_key=True)

  responder = db.relationship('Responder', backref='responses')
  responder_id = db.Column(db.Integer, db.ForeignKey('responder.id'), primary_key=True)

  video = db.relationship('Video', backref=backref('response', uselist=False))
  video_id = db.Column(UUID(as_uuid=True), db.ForeignKey('video.id'), nullable=True)

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<Response:{} - {}:{}'.format(self.id, self.challenge.name, self.responder.name)
