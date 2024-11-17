#!/bin/bash
cd .
python manage.py runserver &
cd ./frontend
npm start
