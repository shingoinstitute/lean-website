# from django.db import models
#
# # Create your models here.
# class File(models.Model):
#     id = models.AutoField(primary_key=True)
#     filename = models.CharField(max_length=255, blank=False)
#     author = models.CharField(max_length=255)
#     last_author = models.CharField(max_length=255)
#     created = models.DateTimeField(auto_now_add=True, auto_now=False)
#     updated = models.DateTimeField(auto_now_add=False, auto_now=True)
#     version = IntegerField(default=1)
#     fk = ForeignKey('Files', on_delete=models.CASCADE)
#
# class Files(model.Model):
#     id = models.AutoField(primary_key=True)
#
