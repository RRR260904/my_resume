import os
from pymongo import MongoClient
from django.conf import settings

_mongo_client = None

def get_mongo_db():
    global _mongo_client
    if _mongo_client is None:
        uri = getattr(settings, 'MONGODB_URI', os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/portfolio_db'))
        _mongo_client = MongoClient(uri)
    db_name = getattr(settings, 'MONGODB_DB_NAME', os.environ.get('MONGODB_DB_NAME', 'portfolio_db'))
    return _mongo_client[db_name]
