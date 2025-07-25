# Generated by Django 5.2 on 2025-05-03 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_user_email'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='book',
            name='core_book_publica_efdc9d_idx',
        ),
        migrations.RenameField(
            model_name='book',
            old_name='is_academic_book',
            new_name='is_bachlore_book',
        ),
        migrations.RemoveField(
            model_name='book',
            name='stream',
        ),
        migrations.AddField(
            model_name='book',
            name='category',
            field=models.CharField(choices=[('TEXTBOOK', 'Text Book'), ('REFERENCE', 'Reference Book'), ('GUIDEBOOK', 'Guide Book'), ('SOLUTION', 'Solution'), ('OTHER', 'Other')], default='OTHER', max_length=20),
        ),
        migrations.AlterField(
            model_name='book',
            name='condition',
            field=models.CharField(choices=[('LIKE NEW', 'Like New'), ('GDOD', 'Good'), ('MODERATE', 'Moderate'), ('POOR', 'Poor')], max_length=10),
        ),
        migrations.AlterField(
            model_name='book',
            name='edition',
            field=models.CharField(choices=[('FIRST', 'First Edition'), ('SECOND', 'Second Edition'), ('THIRD', 'Third Edition'), ('FOURTH', 'Fourth Edition'), ('FIFTH', 'Fifth Edition')], default='FIRST', max_length=10),
        ),
        migrations.AlterField(
            model_name='book',
            name='grade',
            field=models.CharField(blank=True, choices=[('FIRST', 'First'), ('SECOND', 'Second'), ('THIRD', 'Third'), ('FOURTH', 'Fourth'), ('FIFTH', 'Fifth'), ('SIXTH', 'Sixth'), ('SEVENTH', 'Seventh'), ('EIGHTH', 'Eighth'), ('NINTH', 'Ninth'), ('TENTH', 'Tenth')], null=True),
        ),
        migrations.AlterField(
            model_name='book',
            name='latitude',
            field=models.FloatField(default=None),
        ),
        migrations.AlterField(
            model_name='book',
            name='longitude',
            field=models.FloatField(default=None),
        ),
        migrations.AlterField(
            model_name='book',
            name='publication',
            field=models.CharField(default=None, max_length=255),
        ),
    ]
