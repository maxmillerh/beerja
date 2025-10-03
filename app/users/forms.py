from django import forms
from django.contrib.auth.models import User
from .models import Profile

class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField(required=True, label="Электронная почта")
    avatar = forms.ImageField(label="Аватар", required=False, widget=forms.FileInput(attrs={'accept': 'image/*'}))

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user and hasattr(user, 'profile'):
            self.fields['avatar'].initial = user.profile.avatar