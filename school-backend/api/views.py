from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Teacher
from .serializers import TeacherSerializer
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model

class HelloView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Olá, você está autenticado!"})

class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        required_fields = ['ni', 'password', 'name', 'email', 'position']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"Campo '{field}' é obrigatório!"}, status=400)
            
        try:
            user = Teacher.objects.create_user(
                username=data['ni'],
                password=data['password'],
                name=data['name'],
                email=data['email'],
                position=data['position'],
            )
            return Response({"message": f"User {user.username} created successfully!"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ni = request.data.get('ni')
        password = request.data.get('password')

        user = get_user_model().objects.get(ni=ni)
        if not user.check_password(password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)

        if user:
            # Gerando token de acesso e refresh token
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        return Response({'error': 'Credenciais inválidas'}, status=401)

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
        teacher = self.__getattribute__(pk)
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
            return Response({"error": "Funcionário not found"}, status=status.HTTP_404_NOT_FOUND)
        
        teacher.delete()
        return Response({"message": "Funcionário deletado com sucesso"}, status=status.HTTP_204_NO_CONTENT)

