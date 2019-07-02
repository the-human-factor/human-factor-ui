import factory
import api.models as m

from uuid import uuid4

class VideoFactory(factory.alchemy.SQLAlchemyModelFactory):
  class Meta:
    model = m.Video
    sqlalchemy_session = m.db.session

  name = factory.Faker('name')
  url = factory.Faker('url')

class ChallengeFactory(factory.alchemy.SQLAlchemyModelFactory):
  class Meta:
    model = m.Challenge
    sqlalchemy_session = m.db.session

  name = factory.Faker('name')
  description = factory.Faker('text')
  grading_rubric = factory.Faker('text')
  notes = factory.Faker('text')

  video = factory.SubFactory(VideoFactory)

class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
  class Meta:
    model = m.User
    sqlalchemy_session = m.db.session

  name = factory.Faker('name')
  email = factory.Faker('email')


class ResponseFactory(factory.alchemy.SQLAlchemyModelFactory):
  class Meta:
    model = m.Response
    sqlalchemy_session = m.db.session

  challenge = factory.SubFactory(ChallengeFactory)
  video = factory.SubFactory(VideoFactory)
  user = factory.SubFactory(ResponderFactory)

class ChallengeWithResponseFactory(ChallengeFactory):
  membership = factory.RelatedFactory(ResponseFactory, 'challenge')
