from flask_marshmallow.sqla import ModelSchema
import api.models as models


class VideoSchema(ModelSchema):
  class Meta:
    model = models.Video

class ChallengeSchema(ModelSchema):
  class Meta:
    model = models.Challenge

class ResponderSchema(ModelSchema):
  class Meta:
    model = models.Responder

class ResponseSchema(ModelSchema):
  class Meta:
    model = models.Response
