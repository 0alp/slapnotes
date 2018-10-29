from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    name = models.CharField(max_length=255, default='')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, related_name="notes",
        on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.text

class Profile(models.Model):
    owner = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE, null=True)
    colorscheme = models.CharField(max_length=100, blank=True, default='molokai')
    layout = models.CharField(max_length=100, blank=True, default='horizontal')
    flavor = models.CharField(max_length=100, blank=True, default='original')
    
    def __str__(self):
        return self.text
