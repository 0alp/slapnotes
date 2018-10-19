from rest_framework import serializers
from .models import Note, Profile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'text', 'name', )

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id','layout','colorscheme','flavor',)

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}
        unique_together = ('email',)

    def validate_email(self, value):
        norm_email = value.lower()
        if User.objects.filter(email=norm_email).exists():
            raise serializers.ValidationError("A user with that email address already exists.")
        return norm_email

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
            validated_data['email'],
            validated_data['password'])

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    password = old_password
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("The password you provided is incorrect.")

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm
    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(_('Error'))

        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_('Invalid e-mail address'))

        return value

    def save(self):
        request = self.context.get('request')
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'EMAIL_HOST_USER'),
            'email_template_name': 'password_email.html',
            'request': request,
        }
        self.reset_form.save(**opts)

class SubmitPasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    uidb64 = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    password2 = serializers.CharField(required=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data
