from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()

class Video(db.Model):
  uid = db.Column(db.String(32), primary_key=True)

  name = db.Column(db.Unicode(255))
  ready_to_stream = db.Column(db.Boolean)

  thumbnail_url = db.Column(db.String(512))
  preview_url = db.Column(db.String(512))

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)


  def __repr__(self):
    return '<Video:{} - {}>'.format(self.uid, self.name)


class Challenge(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  name = db.Column(db.Unicode(length=255), nullable=False)
  description = db.Column(db.UnicodeText, nullable=False)
  grading_rubric = db.Column(db.UnicodeText, nullable=False)
  notes = db.Column(db.UnicodeText, nullable=False)

  video = db.relationship('Video', backref='challenges')
  video_id = db.Column(db.String(32), db.ForeignKey('video.uid'), nullable=True)

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
  id = db.Column(db.Integer, primary_key=True)

  name = db.Column(db.String(255), nullable=False)

  challenge = db.relationship('Challenge', backref='responses')
  challenge_id = db.Column(db.Integer, db.ForeignKey('challenge.id'))

  responder = db.relationship('Responder', backref='responses')
  responder_id = db.Column(db.Integer, db.ForeignKey('responder.id'))

  created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
  updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=datetime.utcnow, nullable=False)

  def __repr__(self):
    return '<Response:{} - {}'.format(self.id, self.name)
