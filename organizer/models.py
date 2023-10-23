from datetime import datetime

from django.db import models


class Appointment(models.Model):
    title = models.TextField()
    slot_validity_from = models.DateTimeField()
    slot_validity_till = models.DateTimeField()
    start_time = models.DateTimeField(default=datetime(2023, 10, 21, 00, 00, 00))
    end_time = models.DateTimeField(default=datetime(2023, 10, 21, 00, 00, 00))

    def __str__(self):
        return f"{self.slot_validity_from} - {self.slot_validity_till}"
