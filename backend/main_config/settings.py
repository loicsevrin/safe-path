import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEBUG = True #Set to False in production
Allowed_HOSTS = ['*']
SECRET_KEY = "AvocadoCheese"

#Application definition
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'users',
    'rest_framework', #for API
    'rest_framework.authtoken',
    'rest_framework_simplejwt' ,#for token-based auth #for CORS with React
    'api.apps.ApiConfig'
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', #for CORS with React
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CSRF_COOKIE_HTTPONLY = True

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',  # 允许来自 localhost:3000 的请求
]

ROOT_URLCONF = 'main_config.urls'

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'Frontend1', 'src'),
            ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.csrf',
            ],
        },
    },
]

WSGI_APPLICATION = 'main_config.wsgi.application'

#Database (?)
DATABASES = {
    'default': {
        'ENGINE':'django.db.backends.postgresql',
        'NAME': 'group03', #Replace with our DB name
        'USER': 'postgres', #Replace with our DB username
        'PASSWORD': 'innovatinsa-piwio-5432', #Replace with our DB password
        'HOST': 'innovatinsa.piwio.fr',   
        'PORT': '5432', #Default port for PostgreSQL

    }
}

AUTH_USER_MODEL = 'auth.User' #Custom user model

#Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {   
     'DEFAULT_AUTHENTICATION_CLASSES':[
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication', 
        # 'rest_framework.permissions.IsAuthenticatedOrReadOnly',
        # 'rest_framework.permissions.AllowAny', 
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ]
}

# REST_FRAMEWORK = {
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.AllowAny',  # 允许所有人访问
#     ],
# }


#CORS settings for React (?)
# CORS_ORIGIN_WHITELIST = [
#     'http://localhost:3000',  # React app
#     'http://our-production-domain.com' #add our production domain here
# ]

CORS_ALLOW_CREDENTIALS = True

# CORS_ALLOW_ALL_ORIGINS = DEBUG #Only allow all origins in development

# settings.py

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",  # React 前端的地址
#     "http://127.0.0.1:3000",  # 也可以添加这个，视你的开发环境而定
# ]

CORS_ALLOW_ALL_ORIGINS = True

CORS_EXPOSE_HEADERS = ['X-CSRFToken'] 

CSRF_COOKIE_SAMESITE = 'Lax'

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]

#Internationalisation
LANGUAGE_CODE = 'en-uk'
TIME_ZONE = 'Asia/Singapore'
USE_I18N = True
USE_L10N = True
USE_TZ = True

#Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'Frontend1','.next','static'),
]

#Media files (user-uploaded files)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'mediafiles'

#Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' #Development
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' #Production
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.getenv('EMAIL_USER')  # Set in '.env'
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD') 

# Security settings for Production
if not DEBUG:
    # HTTPS/SSL
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    # Cookies
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_HTTPONLY = False
    CSRF_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_NAME = 'csrftoken'
    # HSTS (HTTP Strict Transport Security)
    SECURE_HSTS_SECONDS = 86400  # 1 day
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    # Headers
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'

    print("Django Settings Configured!")
    print("="*30)
    print(f"DEBUG: {DEBUG}")
    print(f"Database: PostgreSQL")
    print(f"Time Zone: {TIME_ZONE}")
    print(f"Custom User Model: {AUTH_USER_MODEL}")
    # print(f"CORS Origins: {CORS_ORIGIN_WHITELIST}")
    print("REST Framework: Configured with Token Authentication")