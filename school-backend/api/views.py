from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Teacher
from .serializers import TeacherSerializer
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
import re
from rest_framework.exceptions import ValidationError

# Função para validar e formatar telefone
def validate_and_format_phone(phone):
    print(f"Validando telefone: {phone}")
    phone = re.sub(r'\D', '', phone)  # Remove tudo que não for número
    print(f"Telefone após remover caracteres não numéricos: {phone}")
    if len(phone) != 11:
        raise ValidationError("O telefone deve ter 11 dígitos.")
    formatted_phone = f"({phone[:2]}) {phone[2:7]}-{phone[7:]}"
    print(f"Telefone formatado: {formatted_phone}")
    return formatted_phone

class HelloView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Olá, você está autenticado!"})

class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        print("Dados recebidos:", data)  # Logando os dados recebidos

        # Certifique-se de que está enviando os campos corretos
        required_fields = ['ni', 'password', 'name', 'email', 'phone', 'position']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"Campo '{field}' é obrigatório!"}, status=400)

        # Validação e formatação do telefone
        phone = data.get('phone')
        if phone:
            try:
                phone = str(phone)
                formatted_phone = validate_and_format_phone(phone)  # Formata o telefone
            except ValidationError as e:
                return Response({"error": str(e)}, status=400)
        else:
            return Response({"error": "Campo 'phone' é obrigatório!"}, status=400)

        # Certifique-se de que 'ni' seja único
        if Teacher.objects.filter(ni=data['ni']).exists():
            return Response({"error": f"O NI {data['ni']} já está registrado."}, status=400)

        try:
            # Criação do usuário
            user = Teacher.objects.create_user(
                username=data['ni'],  # 'ni' utilizado como username
                password=data['password'],
                name=data['name'],
                email=data['email'],
                phone=formatted_phone,  # Aqui você está atribuindo o telefone formatado
                position=data['position'],
            )
            return Response({"message": f"Usuário {user.username} criado com sucesso!"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ni = request.data.get('ni')
        password = request.data.get('password')

        try:
            user = get_user_model().objects.get(ni=ni)
        except get_user_model().DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({'error': 'Senha inválida'}, status=status.HTTP_401_UNAUTHORIZED)

        # Gerando token de acesso e refresh token
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

# CRUD
class TeacherListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teachers = Teacher.objects.all()
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TeacherSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

class TeacherDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Teacher.objects.get(pk=pk)
        except Teacher.DoesNotExist:
            return None

    def get(self, request, pk):
        teacher = self.get_object(pk)

        if not teacher:
            return Response({"error": "Funcionário não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)

    def put(self, request, pk):
        teacher = self.get_object(pk)
        if not teacher:
            return Response({"error": "Funcionário não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeacherSerializer(teacher, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        teacher = self.get_object(pk)

        if not teacher:
            return Response({"error": "Funcionário não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        teacher.delete()
        return Response({"message": "Funcionário deletado com sucesso"}, status=status.HTTP_204_NO_CONTENT)
