from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .forms import UserUpdateForm
from .models import Profile  

User = get_user_model()

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  
            return redirect('/')
    else:
        form = UserCreationForm()
    return render(request, "users/register.html", {"form": form})

@login_required
def profile(request):
    return render(request, 'users/profile.html')

@login_required
def edit_profile(request):
    
    if not hasattr(request.user, 'profile'):
        Profile.objects.create(user=request.user)
    
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, request.FILES, instance=request.user, user=request.user)
        if form.is_valid():
            form.save() 
            profile = request.user.profile
            if 'avatar' in request.FILES:
                profile.avatar = request.FILES['avatar']
                profile.save()
            return redirect('profile')  
    else:
        form = UserUpdateForm(instance=request.user, user=request.user) 
    
    return render(request, 'users/edit_profile.html', {'form': form})