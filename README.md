<h1>👋notes (aka slapnotes)</h1>
A basic notepad site inspired by <a href="http://v1k45.com/blog/modern-django-part-1-setting-up-django-and-react/">this awesome tutorial</a> but enhanced with a markdown editor, note titles, a better UI, site emails, etc.

Features:
- Token-based authentication
- Markdown editor
- 2 colorschemes + support for more
- Password reset, forgot password functionality
- Mobile responsive

To start dev servers:
- API - `cd slapnote && python manage.py runserver`
- Frontent - `cd frontend && npm run start`

Steps for deployment with Apache 2:
- Clone repo to webserver and pull latest code
- Move to repo folder - `cd slapnotes`
- Create virtualenv - `virtualenv -p python3 .` NOTE: If you are on Python 3.4, downgrade to Django 2.0 in requirements.txt
- Install packages - `pip install -r requirements.txt`
- Create asset folder - `mkdir assets`
- Move to Django folder - `cd slapnote`
- Build database - `python manage.py makemigrations && python manage.py migrate`
- Collect static files - `python manage.py collectstatic`
- Move to top level - `cd ..`
- Make log folder for apache - `mkdir log`
- Move to frontend - `cd frontend`
- Build production files - `npm run build`
- Move to top level - `cd ..`
- Move assets - `mv assets/ slapnotes/`
- Edit mod.wsgi for multisite server - check custom mod.wsgi... (daemon mode)

`
import os, sys

from django.core.wsgi import get_wsgi_application
 
 
sys.path.append('/var/www/slapnotes/slapnotes/bin/python')
sys.path.append('/var/www/slapnotes/slapnotes/lib/python3.4/site-packages')
sys.path.append('/var/www/slapnotes/slapnotes/')
sys.path.append('/var/www/slapnotes/slapnotes/slapnotes/')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "slapnotes.production_settings")
 
application = get_wsgi_application()
`
- Move to apache directory - `cd /etc/apache2/sites-available`
- Use this conf (but use your site name and path names):

`
WSGIScriptAlias / /var/www/slapnotes/slapnotes/slapnotes/wsgi.py
WSGIPythonHome /var/www/slapnotes
WSGIPythonPath /var/www/slapnotes:/var/www/slapnotes/slapnotes/lib/python3.4
WSGIPassAuthorization On
 
<VirtualHost *:80>
	# Admin email, Server Name (domain name), and any aliases
	ServerAdmin slapnote-admin@slaponic.us
	ServerName xn--note-fi63c.ws
	ServerAlias xn--note-fi63c.ws
	 
	# Index file and Document Root (where the public files are located)
	DirectoryIndex index.html index.php
	DocumentRoot /var/www/slapnotes/slapnotes/slapnotes
	# Log file locations
	LogLevel info
	ErrorLog  /var/www/slapnotes/log/error.log
	CustomLog /var/www/slapnotes/log/access.log combined

	LoadModule wsgi_module /usr/lib/apache2/modules/mod_wsgi.so
  
  
    <Directory /var/www/slapnotes/slapnotes/slapnotes>
 	<Files wsgi.py>
	Require all granted
	</Files>
	</Directory>
	 
	Alias /static/ /var/www/slapnotes/slapnotes/assets/
	 
	<Directory /var/www/slapnotes/slapnotes/assets>
	Require all granted
	</Directory>
	 
	WSGIDaemonProcess slapnotes processes=2 threads=15 display-name=%{GROUP}
	WSGIProcessGroup slapnotes
	 
	WSGIScriptAlias / /var/www/slapnotes/slapnotes/slapnotes/wsgi.py

</VirtualHost>
`
- Enable site - `sudo a2ensite xn--note-fi63c.ws`
- Restart apache - `sudo service apache2 restart`

You will also need to:
- Add allowed hosts to production settings 
- Create a secrets.json file which contains your secret key and API keys in the same directory as manage.py
