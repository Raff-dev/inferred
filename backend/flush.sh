python manage.py flush --no-input > /dev/null 2>&1
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')" > /dev/null 2>&1
echo "Successfully flushed and created Django superuser 'admin' with password 'admin'"
