import os
import json

from sqlalchemy.orm import joinedload
from flask import request, abort, jsonify, current_app
from flask_restful import Resource


import api.models as m
import api.schemas as s

class Video(Resource):
  def get(self, video_id):
    video = m.Video.query.get_or_404(video_id)
    return s.VideoSchema().jsonify(video).json, 200

class CreateVideo(Resource):
  def post(self):
    if 'videoBlob' not in request.files:
      abort(400)

    video = m.Video.create_and_upload(request.files['videoBlob'])
    return s.VideoSchema().jsonify(video).json, 201

class Challenge(Resource):
  def get(self, challenge_id):
    challenge = m.Challenge.query.get_or_404(challenge_id)
    return s.ChallengeSchema().jsonify(challenge).json, 200

class CreateChallenge(Resource):
  def post(self):
    if 'videoBlob' not in request.files:
      abort(400)

    json = request.get_json()

    print("REQUESTFIEL", request.files['videoBlob'])
    video = m.Video().create_and_upload(request.files['videoBlob'])

    # TODO: don't create a new user each time!
    user = m.User(
      name = request.form['name'],
      email = request.form['email']
    )

    user.save()

    challenge = m.Challenge(
      title = request.form['title'],
      instructions = request.form['instructions'],
      grading_notes = request.form['grading_notes'],
      creator = user,
      video = video
    )

    challenge.save()

    return s.ChallengeSchema().jsonify(challenge).json, 201

class ChallengeList(Resource):
  def get(self):
    challenges = m.Challenge.query.options(joinedload('video')).all()

    return s.ChallengeSchema(many=True).jsonify(challenges).json, 200

class Response(Resource):
  def get(self, response_id):
    response = m.Response.get_or_404(response_id)

    return s.ResponseSchema().jsonify(response).json, 200

class ResponseList(Resource):
  def get(self):
    responses = m.Response.query.all()
    return s.ResponseSchema(many=True).jsonify(responses).json, 200


class CreateResponse(Resource):
  def post(self):
    return {"<response>": "response"}, 201
