from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
from bson import ObjectId
from datetime import datetime
from .db import get_mongo_db

def serialize_mongo(doc):
    if not doc:
        return None
    if isinstance(doc, list):
        return [serialize_mongo(item) for item in doc]
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                res[k] = str(v)
                res['id'] = str(v)
            elif isinstance(v, datetime):
                res[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                res[k] = serialize_mongo(v)
            else:
                res[k] = v
        if '_id' in res and 'id' not in res:
            res['id'] = str(res['_id'])
        return res
    return doc

class ProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        doc = db.profiles.find_one({'is_active': True})
        return Response(serialize_mongo(doc) or {})

class AboutView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        doc = db.about.find_one({'is_active': True})
        return Response(serialize_mongo(doc) or {})

class SkillsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.skills.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class ExperienceView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.experiences.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class EducationView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.education.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class ProjectsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.projects.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class ProjectDetailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, slug):
        db = get_mongo_db()
        doc = db.projects.find_one({'slug': slug, 'is_active': True})
        if not doc:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_mongo(doc))

class CertificationsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.certifications.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class AchievementsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.achievements.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class SocialLinksView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        docs = list(db.social_links.find({'is_active': True}).sort('display_order', 1))
        return Response(serialize_mongo(docs))

class ContactView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        db = get_mongo_db()
        doc = db.contact_info.find_one({'is_active': True})
        return Response(serialize_mongo(doc) or {})

    def post(self, request):
        db = get_mongo_db()
        data = request.data
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        if not name or not email or not message:
            return Response({'error': 'Name, email, and message are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        msg_doc = {
            'name': name.strip(),
            'email': email.strip(),
            'subject': data.get('subject', 'Portfolio Inquiry').strip(),
            'message': message.strip(),
            'is_read': False,
            'is_replied': False,
            'created_at': datetime.utcnow()
        }
        result = db.contact_messages.insert_one(msg_doc)
        msg_doc['id'] = str(result.inserted_id)
        return Response({'success': True, 'message': 'Message sent successfully!'}, status=status.HTTP_201_CREATED)

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        db = get_mongo_db()
        admin = db.admins.find_one({'username': username})
        if not admin or not check_password(password, admin.get('password_hash', '')):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Issue JWT
        token = RefreshToken()
        token['username'] = admin['username']
        token['role'] = admin.get('role', 'admin')
        
        return Response({
            'token': str(token.access_token),
            'admin': {
                'id': str(admin['_id']),
                'username': admin['username'],
                'role': admin.get('role', 'admin')
            }
        })

class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        db = get_mongo_db()
        collections = [
            'profiles', 'about', 'skills', 'experiences', 'education',
            'projects', 'certifications', 'achievements', 'social_links',
            'contact_info', 'contact_messages', 'site_settings'
        ]
        counts = {c: db[c].count_documents({}) for c in collections}
        unread = db.contact_messages.count_documents({'is_read': False})
        return Response({
            'counts': counts,
            'unread_messages': unread,
            'database_type': 'MongoDB Atlas'
        })
