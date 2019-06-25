import os

from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api

import api.models as models
import api.resources as resources

app = Flask(__name__)
app.config.from_mapping(
    SQLALCHEMY_DATABASE_URI=os.environ.get('DB_URL', "postgres://human_factors_user@db/human_factors"),
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)

api = Api(app)

db = models.db
db.init_app(app)
migrate = Migrate(app, db)

api.add_resource(resources.VideoList, '/api/videos')
api.add_resource(resources.Video, '/api/videos/<string:video_id>')

api.add_resource(resources.ChallengeList, '/api/challenges')
api.add_resource(resources.Challenge, '/api/challenges/<int:challenge_id>')

api.add_resource(resources.ResponseList, '/api/responses')
api.add_resource(resources.Response, '/api/responses/<int:response_id>')


@app.route('/')
def hello():
    return 'Hello, Brian!'

@app.shell_context_processor
def make_shell_context():
    """
    Adds these to the global scope of the shell for more convenient prototyping/debugging in the shell
    """
    return {'db': db,
            'Video': models.Video,
            'Challenge': models.Challenge,
            'Response': models.Response,
            'Responder': models.Responder}

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=os.environ.get('PORT', 9000))
