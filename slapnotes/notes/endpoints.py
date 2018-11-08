from django.conf.urls import include, url
from rest_framework import routers
from .api import (NoteViewSet, RegistrationAPI, LoginAPI, UserAPI, ProfileViewSet, 
    ChangePasswordAPI, ResetPasswordAPI, SubmitResetPasswordAPI, ContactEmailAPI)
from django.urls import re_path
from knox import views as knox_views

router = routers.DefaultRouter()
router.register('notes', NoteViewSet, 'notes')
router.register('profile', ProfileViewSet, 'profile')

urlpatterns = [
    re_path(r'^api/auth/', include('knox.urls')),
    re_path("^auth/register/$", RegistrationAPI.as_view()),
    re_path("^auth/login/$", LoginAPI.as_view()),
    re_path("^auth/logout/$", knox_views.LogoutView.as_view(), name="knox_logout"),
    re_path("^auth/user/$", UserAPI.as_view()),
    re_path("^auth/password/change/$", ChangePasswordAPI.as_view()),
    re_path("^auth/password/reset/$", ResetPasswordAPI.as_view()),
    re_path("^password_reset_submit/$", SubmitResetPasswordAPI.as_view()),
    re_path("^contact/$", ContactEmailAPI.as_view()),
    re_path("^", include(router.urls)),
]
