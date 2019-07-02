from flask import jsonify

def test_app(app, client):
  res = client.get('/')
  print("Res", res.data)

  assert res.data == b'Hello, Brian!'
  assert res.status_code == 200
