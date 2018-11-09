from rest_framework import serializers
from .models import Note, Profile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import requests

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
        if not norm_email:
            raise serializers.ValidationError("This field may not be blank.")
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
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, data):
        if not data['new_password'] == data['new_password2']:
            raise serializers.ValidationError("New passwords must match.")
        password = data['old_password']
        request = self.context.get('request')
        username = request.user.username
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            return data
        raise serializers.ValidationError("The password you provided is incorrect.")

    def save(self, validated_data):
        request = self.context.get('request')
        username = request.user.username
        user = User.objects.get(username=username)
        user.set_password(validated_data['new_password'])
        user.save()

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(_('Error'))

        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_('No user with that e-mail address is on file.'))

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
        uid = force_text(urlsafe_base64_decode(data['uidb64']))
        user = User.objects.filter(pk=uid).first()        
        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Your password reset link has expired. Please request a new one.")
        return data

class ContactEmailSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    reply = serializers.EmailField(required=True)
    message = serializers.CharField(required=True)
    user = serializers.CharField(required=False, allow_blank=True)
    captcha = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data['user']:
            return data
        if data['captcha']:
            recaptcha_response = data['captcha']
            captcha_data = {
                'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
                'response': recaptcha_response
            }
            r = requests.post('https://www.google.com/recaptcha/api/siteverify', data=captcha_data)
            result = r.json()
            if result['success']:
                return data
        raise serializers.ValidationError('Invalid ReCAPTCHA. Please try again')
