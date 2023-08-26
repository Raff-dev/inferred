python manage.py flush --no-input > /dev/null 2>&1
python manage.py makemigrations
python manage.py migrate

python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')" > /dev/null 2>&1
message="Successfully flushed and created Django superuser 'admin' with password 'admin'"
echo -e "\e[32m$message\e[0m"

python manage.py loaddata inferred/sensors/fixtures/initial_data.json
