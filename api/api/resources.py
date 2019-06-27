import os
import json

from flask import request, abort, jsonify
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
    if 'file' not in request.files:
      abort(400)

    f = request.files['file']

    video = m.Video(name=f.filename)
    video.save()

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(os.environ.get('VIDEO_BUCKET', 'the-human-factor-videos'))
    blob = bucket.blob(str(video.id))

    blob.upload_from_file(f.stream, predefined_acl="publicRead")

    video.update(url=blob.public_url)

    return s.VideoSchema().dump(video).data, 201

class Challenge(Resource):
  def get(self, challenge_id):
    return {"challenge": challenge_id}

class ChallengeList(Resource):
  def get(self):
    return ["more", "challenges", "here"]

class Response(Resource):
  def get(self, response_id):
    return {"response": response_id}

class ResponseList(Resource):
  def get(self):
    return ["responses", "go", "here"]
