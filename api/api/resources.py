import os
from flask import request, abort
from flask_restful import Resource

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

    bucket = os.environ['VIDEO_BUCKET']

    with open('./{}'.format(f.filename), mode='wb+') as out:
      storage_client = storage.Client()
      bucket = storage_client.get_bucket(os.environ['VIDEOS_BUCKET'])
      bucket.blob(f.filename)

      print("Saving video", f.filename)

      f.save(out)

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
