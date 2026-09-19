from django.urls import path
from .views import (
    ProfileView, AboutView, SkillsView, ExperienceView,
    EducationView, ProjectsView, ProjectDetailView,
    CertificationsView, AchievementsView, SocialLinksView,
    ContactView, AdminLoginView, AdminStatsView
)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('about/', AboutView.as_view(), name='about'),
    path('skills/', SkillsView.as_view(), name='skills'),
    path('experience/', ExperienceView.as_view(), name='experience'),
    path('education/', EducationView.as_view(), name='education'),
    path('projects/', ProjectsView.as_view(), name='projects'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project-detail'),
    path('certifications/', CertificationsView.as_view(), name='certifications'),
    path('achievements/', AchievementsView.as_view(), name='achievements'),
    path('social-links/', SocialLinksView.as_view(), name='social-links'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]
