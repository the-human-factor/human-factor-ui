from marshmallow import fields
from flask_marshmallow.sqla import ModelSchema, HyperlinkRelated
import api.models as models


class VideoSchema(ModelSchema):
  class Meta:
    model = models.Video

class UserSchema(ModelSchema):
  class Meta:
    model = models.User

class ChallengeSchema(ModelSchema):
  class Meta:
    model = models.Challenge

  video = fields.Nested(VideoSchema)
  user = fields.Nested(UserSchema)

class ResponseSchema(ModelSchema):
  class Meta:
    model = models.Response

  challenge = fields.Nested(ChallengeSchema)
  video = fields.Nested(VideoSchema)
  user = fields.Nested(UserSchema)
