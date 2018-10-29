from .models import Note, Profile, User
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from knox.models import AuthToken
from django.views.generic.base import TemplateView
from django import forms
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from .serializers import (NoteSerializer, CreateUserSerializer, 
        UserSerializer, LoginUserSerializer, ProfileSerializer,
        ChangePasswordSerializer, PasswordResetSerializer,
        SubmitPasswordResetSerializer, ContactEmailSerializer)


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        return self.request.user.notes.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def get_queryset(self):
        # create default if not exists
        if not Profile.objects.filter(owner=self.request.user):
            serializer = ProfileSerializer(None, data=self.request.data)
            serializer.is_valid()
            serializer.save(owner=self.request.user)
        return Profile.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def put(self, request):
        profile = Profile.objects.filter(owner=self.request.user).first()
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ChangePasswordAPI(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request.data)
        return Response(serializer.data)

class ResetPasswordAPI(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.data)

class PasswordResetConfirmView(TemplateView):
    template_name = "password_reset_confirm.html"

    def get_context_data(self, **kwargs):
        uidb64 = (self.kwargs.get('uidb64', None))
        uid = force_text(urlsafe_base64_decode(uidb64))
        context = super(PasswordResetConfirmView, self).get_context_data(**kwargs)
        context.update({
            'user': User.objects.get(pk=uid),
            'uidb64': self.kwargs.get('uidb64', None),
            'token': self.kwargs.get('token', None),
        })
        return context

class SubmitResetPasswordAPI(generics.GenericAPIView):
# class SubmitResetPasswordAPI(viewsets.ModelViewSet):
    serializer_class = SubmitPasswordResetSerializer
    model = User

    def get_object(self, queryset=None):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = (serializer.data.get('uidb64'))
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(pk=uid).first()
        return user

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.object.set_password(serializer.data.get("password"))
            self.object.save()
            return Response(serializer.data)
        return Response(serializer.errors)                                                                                                                                                                

class ContactEmailAPI(generics.GenericAPIView):
    serializer_class = ContactEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data['name']
        email = serializer.validated_data['reply']
        message = serializer.validated_data['message']
        email_text = "You received a message from {name} at {email}: {message}".format(
                name=name, email=email, message=message)
        send_mail("Contact email from Slapnote", email_text, email, [getattr(settings, 'EMAIL_HOST_USER')])
        return Response(serializer.data)
