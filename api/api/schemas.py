from marshmallow import fields
from flask_marshmallow.sqla import ModelSchema, HyperlinkRelated
import api.models as models


class VideoSchema(ModelSchema):
  class Meta:
    model = models.Video
    exclude = ["challenges", "response"]

class UserSchema(ModelSchema):
  class Meta:
    model = models.User

class ChallengeSchema(ModelSchema):
  class Meta:
    model = models.Challenge

  video = fields.Nested(VideoSchema)

class ResponseSchema(ModelSchema):
  class Meta:
    model = models.Response
