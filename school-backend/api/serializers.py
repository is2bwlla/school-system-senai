from rest_framework import serializers
from .models import Teacher

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'username', 'ni', 'name', 'email', 'phone', 'position']

    # Sobrescrevendo a criação para garantir que 'ni' seja atribuído ao 'username'
    def create(self, validated_data):
        # Garantir que o 'username' seja igual ao 'ni'
        ni = validated_data.get('ni')
        validated_data['username'] = ni
        return super().create(validated_data)
