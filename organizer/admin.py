from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class TagAdmin(admin.ModelAdmin):
    list_display = ("title", "start_time", "end_time")

