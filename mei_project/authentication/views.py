import requests
from django.shortcuts import render, redirect

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/auth/login"
        payload = {
            "email": email,
            "password": password
        }
        
        try:
            response = requests.post(url, json=payload)
            data = response.json()
            
            if response.status_code == 200 and 'authToken' in data:
                token = data['authToken']
                request.session['auth_token'] = token
                request.session['user_id'] = data.get('user_id')
                
                me_url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/auth/me"
                headers = {"Authorization": f"Bearer {token}"}
                try:
                    me_response = requests.get(me_url, headers=headers)
                    if me_response.status_code == 200:
                        user_data = me_response.json()
                        request.session['user_name'] = user_data.get('name')
                except:
                    pass
                
                return redirect('home')
            else:
                error_msg = data.get('message', 'Invalid email or password.')
                return render(request, 'login.html', {'error': error_msg})
                
        except requests.RequestException as e:
            return render(request, 'login.html', {'error': f'Network error: {str(e)}'})
            
    return render(request, 'login.html')

def password_reset(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        
        url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/password_reset"
        payload = {
            "email": email
        }
        
        try:
            response = requests.post(url, json=payload)
            data = response.json()
            
            if response.status_code == 200:
                if data.get('registered') is True:
                    request.session['reset_email'] = email
                    return redirect('create_password')
                else:
                    return render(request, 'password_reset.html', {'error': 'Email address not found.'})
            else:
                 error_msg = data.get('message', 'An error occurred.')
                 return render(request, 'password_reset.html', {'error': error_msg})
                
        except requests.RequestException as e:
            return render(request, 'password_reset.html', {'error': f'Network error: {str(e)}'})
            
    return render(request, 'password_reset.html')

def create_password(request):
    email = request.session.get('reset_email', '')
    
    if request.method == 'POST':
        email_input = request.POST.get('email')
        password = request.POST.get('new_password')
        
        final_email = email_input if email_input else email
        
        url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/auth/update_password"
        payload = {
            "email": final_email,
            "password": password
        }
        
        try:
            response = requests.post(url, json=payload)
            data = response.json()
            
            if response.status_code == 200:
                 if 'code' in data and data['code'] == 'ERROR_CODE_NOT_FOUND':
                     return render(request, 'create_password.html', {'email': final_email, 'error': data.get('message', 'User not found.')})
                     
                 return redirect('login')
            else:
                error_msg = data.get('message', 'An error occurred.')
                return render(request, 'create_password.html', {'email': final_email, 'error': error_msg})
                
        except requests.RequestException as e:
            return render(request, 'create_password.html', {'email': final_email, 'error': f'Network error: {str(e)}'})

    return render(request, 'create_password.html', {'email': email})

def create_account(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/auth/signup"
        payload = {
            "name": name,
            "email": email,
            "password": password
        }
        
        try:
            response = requests.post(url, json=payload)
            data = response.json()
            
            if response.status_code == 200 and 'authToken' in data:
                request.session['auth_token'] = data['authToken']
                request.session['user_id'] = data.get('user_id')
                request.session['user_name'] = name
                return redirect('home')
            else:
                error_msg = data.get('message', 'An error occurred during sign up.')
                return render(request, 'create_account.html', {'error': error_msg})
                
        except requests.RequestException as e:
            return render(request, 'create_account.html', {'error': f'Network error: {str(e)}'})
            
    return render(request, 'create_account.html')

def home(request):
    projects = []
    try:
        url = "https://x8ki-letl-twmt.n7.xano.io/api:X8nXp3-I/projects"
        headers = {}
        if 'auth_token' in request.session:
            headers['Authorization'] = f"Bearer {request.session['auth_token']}"
            
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            projects = response.json()
    except Exception:
        pass
        
    return render(request, 'overview.html', {'projects': projects})

def portfolio(request):
    projects = []
    try:
        url = "https://x8ki-letl-twmt.n7.xano.io/api:X8nXp3-I/projects"
        headers = {}
        if 'auth_token' in request.session:
            headers['Authorization'] = f"Bearer {request.session['auth_token']}"
            
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            projects = response.json()
    except Exception:
        pass
        
    return render(request, 'portfolio.html', {'projects': projects})

def billing(request):
    return render(request, 'billing.html')

def resources(request):
    return render(request, 'resources.html')

def profile(request):
    user_email = request.session.get('user_email', '')
    
    if request.method == 'GET' and 'auth_token' in request.session:
        try:
            me_url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/auth/me"
            headers = {"Authorization": f"Bearer {request.session['auth_token']}"}
            me_response = requests.get(me_url, headers=headers)
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                request.session['user_name'] = user_data.get('name', '')
                request.session['user_email'] = user_data.get('email', '')
        except:
            pass
    
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        auth_token = request.session.get('auth_token')
        
        if not auth_token:
            return render(request, 'profile.html', {'error': 'Authentication required. Please log in again.'})
        
        payload = {}
        if name:
            payload['name'] = name
        if email:
            payload['email'] = email
        if password: 
            payload['password'] = password
        
        url = "https://x8ki-letl-twmt.n7.xano.io/api:QW2Cw8Kl/update_user"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.patch(url, json=payload, headers=headers)
            data = response.json()
            
            if response.status_code == 200:
                if name:
                    request.session['user_name'] = name
                if email:
                    request.session['user_email'] = email
                
                return render(request, 'profile.html', {'success': 'Profile updated successfully!'})
            else:
                error_msg = data.get('message', 'An error occurred while updating profile.')
                return render(request, 'profile.html', {'error': error_msg})
                
        except requests.RequestException as e:
            return render(request, 'profile.html', {'error': f'Network error: {str(e)}'})
    
    return render(request, 'profile.html')

def logout(request):
    request.session.flush()
    return redirect('login')
