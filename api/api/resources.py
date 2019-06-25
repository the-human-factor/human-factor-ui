from flask_restful import Resource

import api.models as m

class Video(Resource):
  def get(self, video_id):
    return m.Video.query

class VideoList(Resource):
  def get(self):
    return ["videos", "more", "video"]

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
