import os
import json

from flask import request, abort, jsonify, current_app
from flask_restful import Resource

from google.cloud import storage

import api.models as m
import api.schemas as s

class Video(Resource):
  def get(self, video_id):
    video = m.Video.query.get(video_id)

    if video:
      return s.VideoSchema().dumps(video).data
    else:
      abort(404)

class VideoList(Resource):
  def get(self):
    return ["videos", "more", "video"]

  def post(self):
    if 'videoBlob' not in request.files:
      abort(400)

    video = create_and_upload_video(request.files['videoBlob'])

    return s.VideoSchema().dump(video).data, 201

    

class Challenge(Resource):
  def get(self, challenge_id):
    return {"challenge": challenge_id}

class CreateChallenge(Resource):
  def post(self):
    if 'videoBlob' not in request.files:
      abort(400)

    video = create_and_upload_video(request.files['videoBlob'])

    

    return s.VideoSchema().dump(video).data, 201

class ChallengeList(Resource):
  def get(self):
    return ["more", "challenges", "here"]

class Response(Resource):
  def get(self, response_id):
    return {"response": response_id}

class ResponseList(Resource):
  def get(self):
    return ["responses", "go", "here"]

def create_and_upload_video(file):
  video = m.Video(name=file.filename)
  video.save()

  storage_client = storage.Client()
  bucket = storage_client.get_bucket(current_app.config['VIDEO_BUCKET'])
  blob = bucket.blob(str(video.id))

  blob.upload_from_file(file.stream, predefined_acl="publicRead")

  video.update(url=blob.public_url)

  return video
