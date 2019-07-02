from flask_marshmallow.sqla import ModelSchema
import api.models as models


class VideoSchema(ModelSchema):
  class Meta:
    model = models.Video
    exclude = ["challenges", "response"]

class ChallengeSchema(ModelSchema):
  class Meta:
    model = models.Challenge

class UserSchema(ModelSchema):
  class Meta:
    model = models.User

class ResponseSchema(ModelSchema):
  class Meta:
    model = models.Response
