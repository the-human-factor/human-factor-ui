import pytest
from api.models import db as _db


@pytest.fixture
def app():
  """Global app fixture for testing"""
  from api.app import create_app
  app = create_app()
  return app
