from flask_restful import Api
import api.resources as resources

api = Api()

api.add_resource(resources.Video, '/api/videos/<string:video_id>')
api.add_resource(resources.CreateVideo, '/api/videos/create')

api.add_resource(resources.ChallengeList, '/api/challenges')
api.add_resource(resources.CreateChallenge, '/api/challenges/create')
api.add_resource(resources.Challenge, '/api/challenges/<string:challenge_id>')

api.add_resource(resources.ResponseList, '/api/responses')
api.add_resource(resources.CreateResponse, '/api/responses/create')
api.add_resource(resources.Response, '/api/responses/<string:response_id>')
